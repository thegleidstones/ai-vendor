import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageLangChainDocument = ChatMessageLangChain & Document;

@Schema({ timestamps: true })
export class ChatMessageLangChain {
  @Prop({ required: true })
  phone: string;

  @Prop({ enum: ['user', 'ai'], required: true })
  role: 'user' | 'ai';

  @Prop({ type: String, required: true })
  content: string;
}

export const ChatMessageLangChainSchema =
  SchemaFactory.createForClass(ChatMessageLangChain);
