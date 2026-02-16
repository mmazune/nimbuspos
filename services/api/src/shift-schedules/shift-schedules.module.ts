import { Module } from '@nestjs/common';
import { ShiftSchedulesService } from './shift-schedules.service';
import { ShiftSchedulesController } from './shift-schedules.controller';
@Module({
  imports: [],
  controllers: [ShiftSchedulesController],
  providers: [ShiftSchedulesService],
  exports: [ShiftSchedulesService],
})
export class ShiftSchedulesModule {}
