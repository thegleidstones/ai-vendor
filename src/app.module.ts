import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ChatModule } from './chat/chat.module';
import { IaModule } from './ia/ia.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [WhatsappModule, ChatModule, IaModule, ProductsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
