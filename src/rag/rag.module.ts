import { Module } from '@nestjs/common';
import { LangchainService } from './langchain/langchain.service';
import { EmbeddingService } from './embedding/embedding.service';
import { QdrantService } from './qdrant/qdrant.service';
import { RagController } from './rag.controller';
import { ScrapingModule } from 'src/scraping/scraping.module';
import { RagService } from './rag.service';

@Module({
  imports: [ScrapingModule],
  providers: [LangchainService, EmbeddingService, QdrantService, RagService],
  controllers: [RagController],
})
export class RagModule {}
