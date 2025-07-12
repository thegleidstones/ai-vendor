import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('webhook/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  async handleIncomingMessage(@Body() payload: any) {
    return this.whatsappService.handleIncoming(payload);
  }
}
