import { Module } from '@nestjs/common';
import { MeController, BranchesController } from './me.controller';
@Module({
  controllers: [MeController, BranchesController],
  providers: [],
})
export class MeModule {}
