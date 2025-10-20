import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WahaController } from './waha.controller';
import { WahaService } from './waha.service';

@Module({
  imports: [ConfigModule],
  controllers: [WahaController],
  providers: [WahaService],
  exports: [WahaService],
})
export class WahaModule {}
