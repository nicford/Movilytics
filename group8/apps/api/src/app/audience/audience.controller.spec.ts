import { Test, TestingModule } from '@nestjs/testing';
import { AudienceController } from './audience.controller';

describe('AudienceController', () => {
  let controller: AudienceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AudienceController],
    }).compile();

    controller = module.get<AudienceController>(AudienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
