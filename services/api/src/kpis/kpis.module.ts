import { Module } from '@nestjs/common';
import { KpisController } from './kpis.controller';
import { KpisService } from './kpis.service';
import { SseRateLimiterGuard } from '../common/sse-rate-limiter.guard';
// ObservabilityModule is @Global(), no need to import

@Module({
  imports: [], // ObservabilityModule is @Global()
  controllers: [KpisController],
  providers: [KpisService, SseRateLimiterGuard],
  exports: [KpisService],
})
export class KpisModule {}
