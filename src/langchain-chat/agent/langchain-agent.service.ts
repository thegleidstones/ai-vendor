import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatMessageLangChain } from '../types/chat-message-langchain.type';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class LangchainAgentService {
  private readonly chatModel: ChatGoogleGenerativeAI;

  constructor() {
    this.chatModel = new ChatGoogleGenerativeAI({
      model: 'gemini-2.0-flash',
      temperature: 0.3,
      maxOutputTokens: 1024,
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }

  async gerarResposta(
    historico: ChatMessageLangChain[],
    novaMensagem: string,
    contexto: string,
  ): Promise<string> {
    const mensagensFormatadas = historico.map((msg) => {
      return msg.role === 'user'
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content);
    });

    mensagensFormatadas.push(new HumanMessage(novaMensagem));

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'Você é um atendente virtual especializado em vendas de roupas. Responda de forma simpática, clara e útil.',
      ],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);

    const chain = RunnableSequence.from([
      prompt,
      this.chatModel,
      new StringOutputParser(),
    ]);

    try {
      const resposta = await chain.invoke({
        history: mensagensFormatadas,
        input: novaMensagem,
        context: contexto,
      });

      return resposta;
    } catch (error) {
      console.error('Erro ao gerar resposta com LangChain', error);
      return 'Desculpe, algo deu errado ao tentar responder.Por favor tente novamente ou fale com um atendente.';
    }
  }

  /*
  async buildChainComMemoria(phone: string): Promise<RunnableSequence> {
    const memory = new BufferMemory({
      chatHistory: new ChatMessageHistory(phone, this.chatService),
      returnMessages: true,
      memoryKey: 'history',
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', 'Você é um atendente virtual especializado em roupas. Responda de forma simpática, clara e útil.'],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);

    return RunnableSequence.from([
      {
        input: async (vars: any) => ({
          input: vars.input,
          history: await memory.chatHistory.getMessages(),
        }),
      },
      prompt,
      this.chatModel,
      new StringOutputParser(),
    ]);
  }*/
}
