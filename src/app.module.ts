import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ChatModule } from './chat/chat.module';
import { IaModule } from './ia/ia.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { ScrapingModule } from './scraping/scraping.module';
import { RagModule } from './rag/rag.module';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/bluggerbot',
    ),
    WhatsappModule,
    ChatModule,
    IaModule,
    ProductsModule,
    OrdersModule,
    ScrapingModule,
    RagModule,
    LangchainChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
