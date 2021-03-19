import { Test, TestingModule } from '@nestjs/testing';
import { MovieReportController } from './movie-report.controller';

describe('MovieReportController', () => {
  let controller: MovieReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieReportController],
    }).compile();

    controller = module.get<MovieReportController>(MovieReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
