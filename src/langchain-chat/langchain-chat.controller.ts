import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { LangchainChatService } from './langchain-chat.service';
import { ChatMessageLangChain } from './types/chat-message-langchain.type';
import { ChatMessageLangchainService } from './chat-message-langchain/chat-message-langchain.service';

@Controller('langchain-chat')
export class LangchainChatController {
  constructor(
    private readonly chatService: LangchainChatService,
    private readonly chatMessageLangchainService: ChatMessageLangchainService,
  ) {}

  @Post()
  async conversar(
    @Body() body: { sessionId: string; mensagem: string },
  ): Promise<{ resposta: string }> {
    const resposta = await this.chatService.processMessage(
      body.mensagem,
      body.sessionId,
    );

    return { resposta };
  }

  @Get('history')
  async getHistoryFull(): Promise<ChatMessageLangChain[]> {
    return await this.chatMessageLangchainService.listarHistoricoCompleto();
  }

  @Get('history/:phone')
  async getHistory(@Param('phone') phone: string) {
    return await this.chatMessageLangchainService.listarHistorico(phone);
  }
}
