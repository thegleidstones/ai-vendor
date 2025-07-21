import { Module } from '@nestjs/common';
import { LangchainChatController } from './langchain-chat.controller';
import { LangchainChatService } from './langchain-chat.service';
import { ChatMessageLangchainService } from './chat-message-langchain/chat-message-langchain.service';
import { RagModule } from 'src/rag/rag.module';
import { LangchainAgentService } from './agent/langchain-agent.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatMessageLangChain,
  ChatMessageLangChainSchema,
} from './chat-message-langchain/schema/chat-message-langchain.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessageLangChain.name, schema: ChatMessageLangChainSchema },
    ]),
    RagModule,
  ],
  controllers: [LangchainChatController],
  providers: [
    LangchainChatService,
    ChatMessageLangchainService,
    LangchainAgentService,
  ],
  exports: [LangchainChatService],
})
export class LangchainChatModule {}
