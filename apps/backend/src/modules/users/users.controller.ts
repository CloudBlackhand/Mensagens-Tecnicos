import { 
  Controller, 
  Get, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  UseGuards,
  ParseUUIDPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('api/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário atual' })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  async getCurrentUser(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Obter estatísticas do usuário atual' })
  @ApiResponse({ status: 200, description: 'Estatísticas do usuário' })
  async getCurrentUserStats(@CurrentUser() user: any) {
    return this.usersService.getUserStats(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar dados do usuário atual' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  async updateCurrentUser(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obter estatísticas do usuário por ID' })
  @ApiResponse({ status: 200, description: 'Estatísticas do usuário' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async getUserStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário deletado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }
}
