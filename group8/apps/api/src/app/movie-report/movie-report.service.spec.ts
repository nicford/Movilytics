import { Test, TestingModule } from '@nestjs/testing';
import { MovieReportService } from './movie-report.service';

describe('MovieReportService', () => {
  let service: MovieReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieReportService],
    }).compile();

    service = module.get<MovieReportService>(MovieReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
