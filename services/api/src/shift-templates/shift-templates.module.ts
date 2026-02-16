import { Module } from '@nestjs/common';
import { ShiftTemplatesService } from './shift-templates.service';
import { ShiftTemplatesController } from './shift-templates.controller';
@Module({
  imports: [],
  controllers: [ShiftTemplatesController],
  providers: [ShiftTemplatesService],
  exports: [ShiftTemplatesService],
})
export class ShiftTemplatesModule {}
