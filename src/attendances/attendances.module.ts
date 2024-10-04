import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesResolver } from './attendances.resolver';

@Module({
  providers: [AttendancesService, AttendancesResolver]
})
export class AttendancesModule {}
