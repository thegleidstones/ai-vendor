/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntentsService {
  async detect(
    message: string,
  ): Promise<'produto' | 'pedido' | 'entrega' | 'troca' | 'outro'> {
    const texto = message.toLowerCase();

    if (this.isProduto(texto)) return 'produto';
    if (this.isPedido(texto)) return 'pedido';
    if (this.isEntrega(texto)) return 'entrega';
    if (this.isTroca(texto)) return 'troca';

    return 'outro';
  }

  private isProduto(texto: string): boolean {
    return /camisa|calça|vestido|short|bermuda|produto|tamanho|cor|estoque|tem.*dispon[ií]vel/.test(
      texto,
    );
  }

  private isPedido(texto: string): boolean {
    return /pedido|compra|número do pedido|código do pedido/.test(texto);
  }

  private isEntrega(texto: string): boolean {
    return /entrega|transportadora|rastreio|rastreamento|chegando|status da entrega/.test(
      texto,
    );
  }

  private isTroca(texto: string): boolean {
    return /troca|devolução|devolver|não serviu|defeito/.test(texto);
  }
}
