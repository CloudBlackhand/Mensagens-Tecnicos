import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SheetsQueryDto {
  @ApiProperty({ 
    description: 'Forçar atualização (ignorar cache)', 
    required: false,
    default: false 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  @IsBoolean()
  forceRefresh?: boolean = false;

  @ApiProperty({ 
    description: 'Range específico da planilha (ex: A1:Z100)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  range?: string;
}
