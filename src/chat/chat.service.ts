import { Injectable } from '@nestjs/common';
import { IaService } from 'src/ia/ia.service';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { IntentsService } from './intents.service';
import { HistoryMessage } from './types/history-message.type';
import { ChatMessageService } from './chat-message.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly intents: IntentsService,
    private readonly ia: IaService,
    private readonly products: ProductsService,
    private readonly orders: OrdersService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  private memoria = new Map<string, HistoryMessage[]>();

  // Método público principal
  async processMessage(
    message: string,
    phone: string,
  ): Promise<string | undefined> {
    const contexto = await this.analisarContexto(message, phone);

    const { history, mensagemFinal } = await this.processarHistorico(
      message,
      phone,
      contexto,
    );

    const resposta = await this.ia.responderComHistorico(
      history,
      mensagemFinal,
    );

    if (resposta) {
      await this.chatMessageService.salvar(phone, 'model', resposta);
    }

    return resposta;
  }

  // 1. Detecta a intenção e monta o contexto com base no conteúdo da mensagem
  private async analisarContexto(
    message: string,
    phone: string,
  ): Promise<string> {
    const intent = await this.intents.detect(message);

    if (intent === 'pedido') {
      const pedido = await this.orders.buscarPedidoPorTelefone(phone);
      return `Status do pedido: ${pedido.status}, transportadora: ${pedido.transportadora}`;
    }

    if (intent === 'produto') {
      const produto = await this.products.buscarPorNomeNaMensagem(message);
      return `Produto: ${produto.nome}, tamanhos disponíveis: ${produto.tamanhos.join(', ')}`;
    }

    return ''; // sem contexto
  }

  // 2. Recupera ou inicia o histórico e gera a mensagem final com contexto
  private async processarHistorico(
    message: string,
    phone: string,
    contexto: string,
  ): Promise<{ history: HistoryMessage[]; mensagemFinal: string }> {
    const mensagensMongo = await this.chatMessageService.listarHistorico(phone);
    const history: HistoryMessage[] = [];

    history.push({
      role: 'user',
      parts: [
        {
          text:
            'Você é um atendente virtual de uma loja de roupas. ' +
            'Responda de forma clara, objetiva e profissional às dúvidas dos clientes. ' +
            'Caso não tenha certeza da resposta, peça que o cliente entre em contato com um atendente humano.',
        },
      ],
    });

    history.push({
      role: 'model',
      parts: [
        {
          text: 'Claro, estou à disposição para ajudar com dúvidas sobre produtos, pedidos e entregas.',
        },
      ],
    });

    for (const msg of mensagensMongo) {
      history.push({
        role: msg.role,
        parts: [{ text: msg.content }],
      });
    }

    const mensagemFinal = contexto
      ? `${message}\n\n[Contexto]: ${contexto}`
      : message;

    history.push({
      role: 'user',
      parts: [{ text: mensagemFinal }],
    });

    await this.chatMessageService.salvar(phone, 'user', mensagemFinal);

    return { history, mensagemFinal };
  }
}
