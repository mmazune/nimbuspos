import { Module } from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';
import { IdempotencyInterceptor } from './idempotency.interceptor';
/**
 * M21: Common Module
 *
 * Provides shared services and interceptors for API:
 * - Idempotency infrastructure (M16/M21)
 * - Future: Rate limiting, caching, etc.
 */
@Module({
  providers: [IdempotencyService, IdempotencyInterceptor],
  exports: [IdempotencyService, IdempotencyInterceptor],
})
export class CommonModule {}
