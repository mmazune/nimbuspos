import { Module, forwardRef } from '@nestjs/common';
import { StaffModule } from '../staff/staff.module';
import { AntiTheftService } from './anti-theft.service';
import { AntiTheftController } from './anti-theft.controller';

@Module({
  imports: [forwardRef(() => StaffModule)],
  providers: [AntiTheftService],
  controllers: [AntiTheftController],
  exports: [AntiTheftService],
})
export class AntiTheftModule {}
