import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SheetsController } from './sheets.controller';
import { SheetsService } from './sheets.service';
import { SheetsCacheService } from './sheets.cache.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [SheetsController],
  providers: [SheetsService, SheetsCacheService, PrismaService],
  exports: [SheetsService, SheetsCacheService],
})
export class SheetsModule {}
