import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { IaService } from 'src/ia/ia.service';
import { ProductsService } from 'src/products/products.service';
import { OrdersService } from 'src/orders/orders.service';
import { IntentsService } from './intents.service';
import { ChatMessageService } from './chat-message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-message.schema';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    IaService,
    IntentsService,
    ChatMessageService,
    ProductsService,
    OrdersService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
