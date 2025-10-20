import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { SheetsController } from './sheets.controller';
import { SheetsService } from './sheets.service';
import { SheetsCacheService } from './sheets.cache.service';
import { SheetData } from '../../entities/sheet-data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SheetData]),
    ConfigModule,
  ],
  controllers: [SheetsController],
  providers: [SheetsService, SheetsCacheService],
  exports: [SheetsService, SheetsCacheService],
})
export class SheetsModule {}