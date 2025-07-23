import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { ChatMessageLangchainService } from '../chat-message-langchain/chat-message-langchain.service';
import { BaseChatMessageHistory } from '@langchain/core/dist/chat_history';

export class ChatMessageHistory extends BaseChatMessageHistory {
  readonly lc_namespace: ['langchain', 'chat_history', 'mongo'];

  constructor(
    private readonly phone: string,
    private readonly chatService: ChatMessageLangchainService,
  ) {
    super();
  }
  async addUserMessage(message: string): Promise<void> {
    await this.chatService.salvar(this.phone, 'user', message);
  }

  async addAIChatMessage(message: string): Promise<void> {
    await this.chatService.salvar(this.phone, 'ai', message);
  }

  async getMessages(): Promise<BaseMessage[]> {
    const historico = await this.chatService.listarHistorico(this.phone);
    return historico.map((msg) =>
      msg.role === 'user'
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content),
    );
  }

  async addMessage(message: BaseMessage): Promise<void> {
    const role = message.getType() === 'human' ? 'user' : 'ai';

    const contentString =
      typeof message.content === 'string'
        ? message.content
        : JSON.stringify(message.content);

    await this.chatService.salvar(this.phone, role, contentString);
  }

  async clear(): Promise<void> {
    // Opcional: implementar se desejar limpar histórico
  }
}
