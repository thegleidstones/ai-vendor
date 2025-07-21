import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import {
  ChatMessageLangChainDocument,
  ChatMessageLangChain,
} from './schema/chat-message-langchain.schema';

@Injectable()
export class ChatMessageLangchainService {
  constructor(
    @InjectModel(ChatMessageLangChain.name)
    private readonly chatModel: Model<ChatMessageLangChainDocument>,
  ) {}

  async salvar(phone: string, role: 'user' | 'ai', content: string) {
    const msg = new this.chatModel({ phone, role, content });
    return msg.save();
  }

  async listarHistorico(phone: string): Promise<ChatMessageLangChain[]> {
    return this.chatModel.find({ phone }).sort({ createdAt: 1 }).lean().exec();
  }

  async listarHistoricoCompleto(): Promise<ChatMessageLangChain[]> {
    return this.chatModel.find().sort({ createdAt: 1 }).lean().exec();
  }

  async limparHistorico(phone: string): Promise<DeleteResult> {
    return this.chatModel.deleteMany({ phone });
  }
}
