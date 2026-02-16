import { Module } from '@nestjs/common';
import { FloorController, TableController } from './floor.controller';
import { FloorService } from './floor.service';
@Module({
  controllers: [FloorController, TableController],
  providers: [FloorService],
})
export class FloorModule {}
