import { Module } from '@nestjs/common';
import { ShiftAssignmentsService } from './shift-assignments.service';
import { ShiftAssignmentsController } from './shift-assignments.controller';
@Module({
  imports: [],
  controllers: [ShiftAssignmentsController],
  providers: [ShiftAssignmentsService],
  exports: [ShiftAssignmentsService],
})
export class ShiftAssignmentsModule {}
