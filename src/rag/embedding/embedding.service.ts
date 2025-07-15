import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generate(
    texts: string[],
  ): Promise<(number[] | undefined)[] | undefined> {
    const embedder = await this.ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: texts,
      config: {
        taskType: 'SEMANTIC_SIMILARITY',
        outputDimensionality: 768,
      },
    });

    return embedder.embeddings?.map((e) => e.values);
  }

  async generateOne(text: string): Promise<number[]> {
    const embedder = await this.ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
      config: {
        taskType: 'SEMANTIC_SIMILARITY',
        outputDimensionality: 768,
      },
    });

    const values = embedder.embeddings?.[0]?.values;

    if (!values || !Array.isArray(values)) {
      throw new Error('Embedding inválido: não foi possível gerar os valores.');
    }

    return values;
  }
}
