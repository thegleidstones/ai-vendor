// src/chat/chat.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly mensagens: ChatMessageService) {}

  @Get('history')
  async getHistoryFull() {
    return this.mensagens.listarHistoricoCompleto();
  }

  @Get('history/:phone')
  async getHistory(@Param('phone') phone: string) {
    return this.mensagens.listarHistorico(phone);
  }
}
