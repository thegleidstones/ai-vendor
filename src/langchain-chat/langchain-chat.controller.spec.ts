import { Test, TestingModule } from '@nestjs/testing';
import { LangchainChatController } from './langchain-chat.controller';

describe('LangchainChatController', () => {
  let controller: LangchainChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LangchainChatController],
    }).compile();

    controller = module.get<LangchainChatController>(LangchainChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
