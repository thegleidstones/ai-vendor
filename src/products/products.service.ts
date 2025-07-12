/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  async buscarPorNomeNaMensagem(msg: string) {
    if (msg.includes('camisa azul')) {
      return { nome: 'Camisa Azul', tamanhos: ['P', 'M', 'G'] };
    }
    return { nome: 'Produto não encontrado', tamanhos: [] };
  }
}
