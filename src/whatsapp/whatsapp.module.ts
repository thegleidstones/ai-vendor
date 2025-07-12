import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  providers: [WhatsappService],
  controllers: [WhatsappController],
  imports: [ChatModule],
})
export class WhatsappModule {}
