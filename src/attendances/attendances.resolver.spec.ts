import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesResolver } from './attendances.resolver';

describe('AttendancesResolver', () => {
  let resolver: AttendancesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendancesResolver],
    }).compile();

    resolver = module.get<AttendancesResolver>(AttendancesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
