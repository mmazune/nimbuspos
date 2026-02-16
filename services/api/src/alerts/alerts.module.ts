import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
@Module({
  imports: [], // ConfigModule is global
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
