import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EfrisService } from './efris.service';
import { EfrisController } from './efris.controller';
@Module({
  imports: [], // ConfigModule is global
  controllers: [EfrisController],
  providers: [EfrisService],
  exports: [EfrisService],
})
export class EfrisModule {}
