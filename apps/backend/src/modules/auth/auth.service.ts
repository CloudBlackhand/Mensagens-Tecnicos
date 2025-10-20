import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateGoogleUser(userData: any) {
    const { googleId, email, name, picture, accessToken, refreshToken } = userData;

    // Buscar ou criar usuário
    let user = await this.prismaService.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          googleId,
          email,
          name,
          picture,
        },
      });
    } else {
      // Atualizar dados se necessário
      user = await this.prismaService.user.update({
        where: { googleId },
        data: {
          email,
          name,
          picture,
        },
      });
    }

    return user;
  }

  async generateTokens(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '24h'),
    });

    // Salvar sessão no banco
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas

    await this.prismaService.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      
      // Verificar se a sessão existe e não expirou
      const session = await this.prismaService.session.findFirst({
        where: {
          token,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!session) {
        throw new UnauthorizedException('Sessão inválida ou expirada');
      }

      return session.user;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async logout(token: string) {
    await this.prismaService.session.deleteMany({
      where: { token },
    });
  }

  async cleanupExpiredSessions() {
    const deleted = await this.prismaService.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return deleted.count;
  }
}
