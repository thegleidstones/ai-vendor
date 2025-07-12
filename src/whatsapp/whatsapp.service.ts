/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class WhatsappService {
  constructor(private readonly chatService: ChatService) {}

  /*
  async onModuleInit() {
    await this.registerWebhook();
  }

  private async registerWebhook() {
    const baseUrl = process.env.WHAHA_BASE_URL;
    const token = process.env.WHAHA_TOKEN;
    const webhookUrl = process.env.PUBLIC_WEBHOOK_URL;

    const sessionId = 'default'; // ou 'default-session' se você tiver alterado

    if (!baseUrl || !token || !webhookUrl) {
      console.warn(
        '[WHATSAPP] Variáveis de ambiente ausentes. Webhook não registrado.',
      );
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/${sessionId}/hook`,
        { url: webhookUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('[WHATSAPP] Webhook registrado com sucesso:', response.data);
    } catch (error) {
      console.error(
        '[WHATSAPP] Falha ao registrar webhook:',
        error.response?.data || error.message,
      );
    }
  }
  */

  async handleIncoming(payload: any) {
    const msg = payload.message?.text;
    const phone = payload.sender?.number;

    if (!msg || !phone) {
      return { status: 'ignored', reason: 'mensagem ou telefone ausente' };
    }

    // Processa a mensagem com IA
    const resposta = await this.chatService.processMessage(msg, phone);

    // Envia resposta via WHAHA local
    await this.sendMessage(phone, resposta);

    return { status: 'ok' };
  }

  private async sendMessage(phone: string, text: string | undefined) {
    const url = `${process.env.WHAHA_BASE_URL}/api/sendText`;
    const token = process.env.WHAHA_TOKEN;

    try {
      await axios.post(
        url,
        {
          chatId: `${phone}@c.us`, // Formato exigido pela API WHAHA
          text,
          session: 'default',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error(
        '[Erro ao enviar mensagem via WHAHA]',
        error.response?.data || error.message,
      );
    }
  }
}
