import { Injectable } from '@nestjs/common';
import { IaService } from 'src/ia/ia.service';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { IntentsService } from './intents.service';
import { HistoryMessage } from './types/history-message.type';

@Injectable()
export class ChatService {
  constructor(
    private readonly intents: IntentsService,
    private readonly ia: IaService,
    private readonly products: ProductsService,
    private readonly orders: OrdersService,
  ) {}

  private memoria = new Map<string, HistoryMessage[]>();

  // Método público principal
  async processMessage(
    message: string,
    phone: string,
  ): Promise<string | undefined> {
    const contexto = await this.analisarContexto(message, phone);

    const { history, mensagemFinal } = this.processarHistorico(
      message,
      phone,
      contexto,
    );

    const resposta = await this.ia.responderComHistorico(
      history,
      mensagemFinal,
    );

    if (resposta) {
      history.push({
        role: 'model',
        parts: [{ text: resposta }],
      });
      this.memoria.set(phone, history);
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
  private processarHistorico(
    message: string,
    phone: string,
    contexto: string,
  ): { history: HistoryMessage[]; mensagemFinal: string } {
    let history = this.memoria.get(phone);

    if (!history) {
      history = [
        {
          role: 'user',
          parts: [
            {
              text:
                'Você é um atendente virtual de uma loja de roupas. ' +
                'Responda de forma clara, objetiva e profissional às dúvidas dos clientes. ' +
                'Caso não tenha certeza da resposta, peça que o cliente entre em contato com um atendente humano.',
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'Claro, estou à disposição para ajudar com dúvidas sobre produtos, pedidos e entregas.',
            },
          ],
        },
      ];
    }

    const mensagemFinal = contexto
      ? `${message}\n\n[Contexto]: ${contexto}`
      : message;

    history.push({
      role: 'user',
      parts: [{ text: mensagemFinal }],
    });

    return { history, mensagemFinal };
  }
}
