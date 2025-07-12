/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { HistoryMessage } from 'src/chat/types/history-message.type';

@Injectable()
export class IaService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  /**
   * Cria uma nova instância de chat e envia a mensagem do usuário
   * @param userMsg - Texto da mensagem do usuário
   * @param contextInfo - Informações contextuais do produto ou pedido
   */
  async responder(
    userMsg: string,
    contextInfo: string = '',
  ): Promise<string | undefined> {
    try {
      const chat = this.ai.chats.create({
        model: 'gemini-2.0-flash',
        history: [
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
        ],
      });

      const fullMessage = contextInfo
        ? `${contextInfo}\n\nUsuário: ${userMsg}`
        : userMsg;

      const response = await chat.sendMessage({ message: fullMessage });

      return response.text;
    } catch (error) {
      console.error('[IA Gemini Error]', error);
      return 'Desculpe, não consegui entender sua solicitação no momento.';
    }
  }

  async responderComHistorico(
    history: HistoryMessage[],
    userMsg: string,
  ): Promise<string | undefined> {
    try {
      const chat = this.ai.chats.create({
        model: 'gemini-2.0-flash',
        history,
      });

      const response = await chat.sendMessage({ message: userMsg });
      return response.text;
    } catch (error) {
      console.error('[IA Gemini Error]', error);
      return 'Desculpe, não consegui entender sua solicitação no momento.';
    }
  }
}
