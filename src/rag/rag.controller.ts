import { Body, Controller, Post } from '@nestjs/common';
import { RagService } from './rag.service';
import { BuscarDto } from './dtos/buscar.dto';

@Controller('rag')
export class RagController {
  constructor(private readonly rag: RagService) {}

  @Post('indexar-produtos')
  async indexarProdutos() {
    return await this.rag.indexCollection();
  }

  @Post('similarity-search')
  async findProducts(@Body() dto: BuscarDto) {
    const resultados = await this.rag.findProducts(dto);
    return { resultados };
  }

  @Post('delete-collection')
  async deleteCollection() {
    await this.rag.deleteCollection();
  }
}
