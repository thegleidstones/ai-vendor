/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  async buscarPedidoPorTelefone(phone: string) {
    return {
      WhatsApp: phone,
      status: 'Em transporte',
      transportadora: 'Correios',
      codigo: 'AB123',
    };
  }
}
