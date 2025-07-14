import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import {
  ChatMessage,
  ChatMessageDocument,
} from './schemas/chat-message.schema';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatModel: Model<ChatMessageDocument>,
  ) {}

  async salvar(phone: string, role: 'user' | 'model', content: string) {
    const msg = new this.chatModel({ phone, role, content });
    return msg.save();
  }

  async listarHistorico(phone: string): Promise<ChatMessage[]> {
    return this.chatModel.find({ phone }).sort({ createdAt: 1 }).lean().exec();
  }

  async listarHistoricoCompleto(): Promise<ChatMessage[]> {
    return this.chatModel.find().sort({ createdAt: 1 }).lean().exec();
  }

  async limparHistorico(phone: string): Promise<DeleteResult> {
    return this.chatModel.deleteMany({ phone });
  }
}
