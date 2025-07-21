import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessageLangchainService } from './chat-message-langchain.service';

describe('ChatMessageLangchainService', () => {
  let service: ChatMessageLangchainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMessageLangchainService],
    }).compile();

    service = module.get<ChatMessageLangchainService>(
      ChatMessageLangchainService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
