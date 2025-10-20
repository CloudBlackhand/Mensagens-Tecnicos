import { Controller, Get, Req, Res, UseGuards, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Iniciar login com Google OAuth2' })
  async googleAuth(@Req() req: Request) {
    // Este endpoint é interceptado pelo GoogleAuthGuard
    // O usuário será redirecionado para o Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Callback do Google OAuth2' })
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.validateGoogleUser(req.user);
      const tokens = await this.authService.generateTokens(user);

      // Redirecionar para o frontend com o token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${tokens.accessToken}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Erro no callback do Google:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent('Erro na autenticação')}`);
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fazer logout do usuário' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  async logout(@Req() req: Request) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await this.authService.logout(token);
    }

    return { message: 'Logout realizado com sucesso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário atual' })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  async getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      googleId: user.googleId,
    };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Renovar token de acesso' })
  @ApiResponse({ status: 200, description: 'Token renovado' })
  async refreshToken(@CurrentUser() user: any) {
    const tokens = await this.authService.generateTokens(user);
    return tokens;
  }

  @Post('cleanup-sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Limpar sessões expiradas' })
  @ApiResponse({ status: 200, description: 'Sessões limpas' })
  async cleanupSessions() {
    const deletedCount = await this.authService.cleanupExpiredSessions();
    return {
      message: 'Sessões expiradas removidas',
      deletedCount,
    };
  }
}
