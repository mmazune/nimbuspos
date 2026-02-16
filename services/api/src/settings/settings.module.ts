/**
 * E39-s1: Settings Module
 */

import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
@Module({
  controllers: [SettingsController],
  providers: [],
})
export class SettingsModule {}
