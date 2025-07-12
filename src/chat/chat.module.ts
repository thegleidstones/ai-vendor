import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { IntentsService } from './intents.service';
import { IaModule } from 'src/ia/ia.module';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [IaModule, ProductsModule, OrdersModule],
  providers: [ChatService, IntentsService],
  controllers: [ChatController],
  exports: [ChatService, IntentsService],
})
export class ChatModule {}
