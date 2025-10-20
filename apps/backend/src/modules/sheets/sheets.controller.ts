import { 
  Controller, 
  Get, 
  Post, 
  Query, 
  UseGuards, 
  Req,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { SheetsService } from './sheets.service';
import { SheetsQueryDto } from './dto/sheets-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Sheets')
@Controller('api/sheets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Get()
  @ApiOperation({ summary: 'Obter dados da planilha' })
  @ApiResponse({ status: 200, description: 'Dados da planilha' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 500, description: 'Erro ao acessar planilha' })
  async getSheetData(
    @Query() query: SheetsQueryDto,
    @CurrentUser() user: any,
    @Req() req: Request,
  ) {
    // O access token será obtido do header Authorization ou de outra forma
    // Por enquanto, vamos usar o token do usuário logado
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!accessToken) {
      throw new Error('Token de acesso não encontrado');
    }

    return this.sheetsService.getSheetData(accessToken, query.forceRefresh);
  }

  @Get('info')
  @ApiOperation({ summary: 'Obter informações da planilha' })
  @ApiResponse({ status: 200, description: 'Informações da planilha' })
  async getSheetInfo(
    @CurrentUser() user: any,
    @Req() req: Request,
  ) {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!accessToken) {
      throw new Error('Token de acesso não encontrado');
    }

    return this.sheetsService.getSheetInfo(accessToken);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forçar atualização da planilha' })
  @ApiResponse({ status: 200, description: 'Planilha atualizada' })
  async refreshSheetData(
    @CurrentUser() user: any,
    @Req() req: Request,
  ) {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!accessToken) {
      throw new Error('Token de acesso não encontrado');
    }

    return this.sheetsService.refreshSheetData(accessToken);
  }

  @Post('cache/clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Limpar cache da planilha' })
  @ApiResponse({ status: 200, description: 'Cache limpo' })
  async clearCache() {
    await this.sheetsService.clearCache();
    return { message: 'Cache da planilha limpo com sucesso' };
  }

  @Get('cache/stats')
  @ApiOperation({ summary: 'Obter estatísticas do cache' })
  @ApiResponse({ status: 200, description: 'Estatísticas do cache' })
  async getCacheStats() {
    return this.sheetsService.getCacheStats();
  }
}
