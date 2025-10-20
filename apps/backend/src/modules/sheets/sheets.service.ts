import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { PrismaService } from '../../prisma/prisma.service';
import { SheetsCacheService } from './sheets.cache.service';

@Injectable()
export class SheetsService {
  private readonly logger = new Logger(SheetsService.name);
  private readonly sheetId: string;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private sheetsCacheService: SheetsCacheService,
  ) {
    this.sheetId = this.configService.get<string>('GOOGLE_SHEET_ID');
  }

  async getSheetData(accessToken: string, forceRefresh = false): Promise<any> {
    const cacheKey = `sheet_data_${this.sheetId}`;

    // Verificar cache primeiro (se não for refresh forçado)
    if (!forceRefresh) {
      const cachedData = this.sheetsCacheService.get(cacheKey);
      if (cachedData) {
        this.logger.debug('Dados retornados do cache');
        return cachedData;
      }
    }

    try {
      // Configurar cliente OAuth2
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });

      // Configurar Google Sheets API
      const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

      // Obter dados da planilha
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'A:Z', // Todas as colunas, ajustar conforme necessário
      });

      const rows = response.data.values || [];
      
      if (rows.length === 0) {
        this.logger.warn('Planilha está vazia');
        return { headers: [], rows: [] };
      }

      // Processar dados
      const headers = rows[0] || [];
      const dataRows = rows.slice(1);

      const processedData = {
        headers,
        rows: dataRows,
        totalRows: dataRows.length,
        lastUpdated: new Date().toISOString(),
        sheetId: this.sheetId,
      };

      // Salvar no cache
      this.sheetsCacheService.set(cacheKey, processedData);

      // Salvar no banco de dados (opcional)
      await this.saveSheetDataToDatabase(processedData);

      this.logger.log(`Dados da planilha obtidos: ${dataRows.length} linhas`);
      return processedData;

    } catch (error) {
      this.logger.error('Erro ao obter dados da planilha:', error);
      throw new Error(`Erro ao acessar planilha: ${error.message}`);
    }
  }

  private async saveSheetDataToDatabase(data: any): Promise<void> {
    try {
      await this.prismaService.sheetData.upsert({
        where: { sheetId: this.sheetId },
        update: {
          data: JSON.parse(JSON.stringify(data)),
          lastSync: new Date(),
        },
        create: {
          sheetId: this.sheetId,
          data: JSON.parse(JSON.stringify(data)),
          lastSync: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Erro ao salvar dados no banco:', error);
      // Não falhar se não conseguir salvar no banco
    }
  }

  async getSheetInfo(accessToken: string): Promise<any> {
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });

      const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

      const response = await sheets.spreadsheets.get({
        spreadsheetId: this.sheetId,
      });

      const spreadsheet = response.data;
      
      return {
        title: spreadsheet.properties?.title,
        sheetId: this.sheetId,
        sheets: spreadsheet.sheets?.map(sheet => ({
          title: sheet.properties?.title,
          sheetId: sheet.properties?.sheetId,
          gridProperties: sheet.properties?.gridProperties,
        })),
        lastUpdated: new Date().toISOString(),
      };

    } catch (error) {
      this.logger.error('Erro ao obter informações da planilha:', error);
      throw new Error(`Erro ao obter informações da planilha: ${error.message}`);
    }
  }

  async clearCache(): Promise<void> {
    this.sheetsCacheService.clear();
    this.logger.log('Cache da planilha limpo');
  }

  async getCacheStats(): Promise<any> {
    return this.sheetsCacheService.getStats();
  }

  async refreshSheetData(accessToken: string): Promise<any> {
    this.logger.log('Forçando atualização da planilha');
    return this.getSheetData(accessToken, true);
  }
}
