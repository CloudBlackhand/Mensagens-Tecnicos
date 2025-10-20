import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'URL da foto do usuário', required: false })
  @IsOptional()
  @IsUrl()
  picture?: string;
}
