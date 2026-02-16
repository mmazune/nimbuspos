import { Module } from '@nestjs/common';
import { KdsController } from './kds.controller';
import { KdsService } from './kds.service';
import { KdsGateway } from './kds.gateway';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [KdsController],
  providers: [KdsService, KdsGateway],
  exports: [KdsService, KdsGateway],
})
export class KdsModule {}
