/**
 * M33-DEMO-S4: Demo Module
 * 
 * Provides demo protection and time-freeze services that can be injected across the API.
 */

import { Module, Global } from '@nestjs/common';
import { DemoProtectionService } from './demo-protection.service';
import { DemoTimeService } from './demo-time.service';

@Global()
@Module({
  // PrismaService is provided globally by PrismaModule - no need to re-declare
  providers: [DemoProtectionService, DemoTimeService],
  exports: [DemoProtectionService, DemoTimeService],
})
export class DemoModule {}
