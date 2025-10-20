import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { WahaService } from './waha.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('Waha')
@Controller('api/waha')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WahaController {
  constructor(private readonly wahaService: WahaService) {}

  @Get('status')
  @ApiOperation({ summary: 'Obter status do Waha (placeholder)' })
  @ApiResponse({ status: 200, description: 'Status do Waha' })
  async getStatus() {
    return this.wahaService.getStatus();
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Obter sessões do Waha (placeholder)' })
  @ApiResponse({ status: 200, description: 'Lista de sessões' })
  async getSessions() {
    return this.wahaService.getSessions();
  }

  @Post('sessions/:sessionId/send')
  @ApiOperation({ summary: 'Enviar mensagem via Waha (placeholder)' })
  @ApiResponse({ status: 200, description: 'Mensagem enviada' })
  async sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() body: { message: string },
  ) {
    return this.wahaService.sendMessage(sessionId, body.message);
  }
}
