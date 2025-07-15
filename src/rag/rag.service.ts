import { Injectable } from '@nestjs/common';
import { ScrapingService } from 'src/scraping/scraping.service';
import { EmbeddingService } from './embedding/embedding.service';
import { QdrantService } from './qdrant/qdrant.service';
import { ProdutoScraping } from 'src/scraping/types/produto-scraping.type';
import { BuscarDto } from './dtos/buscar.dto';

@Injectable()
export class RagService {
  constructor(
    private readonly scraping: ScrapingService,
    private readonly embeddings: EmbeddingService,
    private readonly qdrant: QdrantService,
  ) {}

  async indexCollection() {
    const produtos: ProdutoScraping[] = await this.scraping.scrapeProdutos();

    await this.qdrant.criarCollection(768);

    let id = 1;

    for (const produto of produtos) {
      const texto = `${produto.descricao}. Categoria: ${produto.categoria.descricao}. Preço: ${produto.preco}. Cor:${produto.cor}. Link Produto: ${produto.urlProduto}. Imagem Produto: ${produto.imagem}`;
      const embedding = await this.embeddings.generateOne(texto);

      if (embedding.length > 0) {
        await this.qdrant.inserirPonto(id++, embedding, produto);
      }
    }

    return { status: 'Produtos indexados com sucesso' };
  }

  async findProducts(dto: BuscarDto) {
    const embedding = await this.embeddings.generateOne(dto.query);

    if (!embedding || embedding.length === 0) {
      throw new Error('Embedding vazio gerado para a consulta');
    }

    const similares = await this.qdrant.buscarSimilar(embedding, 5);

    return similares.map((match) => ({
      score: match.score,
      produto: match.payload,
    }));
  }

  async deleteCollection() {
    await this.qdrant.limparCollection();
  }
}
