/**
 * M18: Documents Module
 */

import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { LocalStorageProvider } from './storage/local.provider';
@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, LocalStorageProvider],
  exports: [DocumentsService],
})
export class DocumentsModule {}
