import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';

type CollectionInfo = Awaited<ReturnType<QdrantClient['getCollection']>>;
type PointStruct = {
  id: number | string;
  vector: number[];
  payload: Record<string, any>;
};

@Injectable()
export class QdrantService {
  private readonly client: QdrantClient;
  private readonly collection: string;
  private readonly logger = new Logger(QdrantService.name);

  constructor(private readonly config: ConfigService) {
    this.client = new QdrantClient({
      url: this.config.get<string>('QDRANT_URL'),
    });
    this.collection =
      this.config.get<string>('QDRANT_COLLECTION') || 'produtos';
  }

  async criarCollection(dim: number): Promise<CollectionInfo | boolean> {
    const existe = await this.client.getCollections();

    if (existe.collections.some((c) => c.name === this.collection)) {
      this.logger.log(`Collection ${this.collection} já existe.`);
      return this.client.getCollection(this.collection);
    }

    this.logger.log(`Criando collection ${this.collection}...`);

    return this.client.createCollection(this.collection, {
      vectors: {
        size: dim,
        distance: 'Cosine',
      },
    });
  }

  async inserirPonto(
    id: number,
    vector: number[],
    payload: Record<string, any>,
  ) {
    const ponto: PointStruct = {
      id,
      vector,
      //vector: { default: vector },
      payload,
    };

    console.dir({ id, vector, payload }, { depth: null });

    await this.client.upsert(this.collection, { points: [ponto] });

    this.logger.log(`Ponto ${id} inserido com sucesso.`);
  }

  async insertPoint(
    id: number,
    vector: number[],
    payload: Record<string, any>,
  ) {
    const ponto: PointStruct = {
      id,
      vector,
      payload,
    };

    console.dir({ id, vector, payload }, { depth: null });

    await this.client.upsert(this.collection, { points: [ponto] });

    this.logger.log(`Ponto ${id} inserido com sucesso.`);
  }

  async buscarSimilar(vector: number[], topK = 15) {
    const result = await this.client.search(this.collection, {
      vector,
      limit: topK,
      with_payload: true,
    });

    return result;
  }

  async limparCollection(): Promise<void> {
    await this.client.deleteCollection(this.collection);
    this.logger.warn(`Collection ${this.collection} apagada!`);
  }
}
