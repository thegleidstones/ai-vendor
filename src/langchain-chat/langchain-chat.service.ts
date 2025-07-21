/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { LangchainAgentService } from './agent/langchain-agent.service';
import { ChatMessageLangchainService } from './chat-message-langchain/chat-message-langchain.service';
import { QdrantService } from 'src/rag/qdrant/qdrant.service';
import { EmbeddingService } from 'src/rag/embedding/embedding.service';
import { detectIntent } from './utils/detect-intent';

@Injectable()
export class LangchainChatService {
  constructor(
    private readonly agent: LangchainAgentService,
    private readonly qdrant: QdrantService,
    private readonly embeddings: EmbeddingService,
    private readonly chatModel: ChatMessageLangchainService,
  ) {}

  async processMessage(message: string, phone: string): Promise<string> {
    // 1. Salva mensagem do usuário
    await this.chatModel.salvar(phone, 'user', message);

    // 2. Detecta intenção
    const intent = detectIntent(message);

    // 3. Gera embedding da mensagem
    const vector = await this.embeddings.generateOne(message);

    // 4. Busca produtos relacionados se intenção for produto
    let contexto = '';
    if (intent === 'produto') {
      const similares = await this.qdrant.buscarSimilar(vector);

      if (similares.length > 0) {
        contexto = similares
          .map((p: any, i: number) => {
            return `
            Produto ${i + 1}:
            - Descrição: ${p.payload.descricao}
            - Cor: ${p.payload.cor}
            - Preço: ${p.payload.preco}`;
          })
          .join('\n\n');
      }
    }

    // 5. Recupera mensagens anteriores
    const historico = await this.chatModel.listarHistorico(phone);

    /*
    const history = historico.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
    */

    // 6. Gera resposta
    const resposta = await this.agent.gerarResposta(
      historico,
      message,
      contexto,
    );

    // 7. Salva resposta da IA
    await this.chatModel.salvar(phone, 'ai', resposta);

    return resposta;
  }
}
