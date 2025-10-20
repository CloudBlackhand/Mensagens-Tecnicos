import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entities/user.entity';
import { Session } from '../../entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateGoogleUser(userData: any) {
    const { googleId, email, name, picture } = userData;

    // Buscar ou criar usuário
    let user = await this.userRepository.findOne({
      where: { googleId },
    });

    if (!user) {
      user = this.userRepository.create({
        googleId,
        email,
        name,
        picture,
      });
      user = await this.userRepository.save(user);
    } else {
      // Atualizar dados se necessário
      await this.userRepository.update(user.id, {
        email,
        name,
        picture,
      });
      user = await this.userRepository.findOne({ where: { id: user.id } });
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

    const session = this.sessionRepository.create({
      userId: user.id,
      token: accessToken,
      expiresAt,
    });
    await this.sessionRepository.save(session);

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
      const session = await this.sessionRepository.findOne({
        where: {
          token,
          expiresAt: new Date(), // Verificar se não expirou
        },
        relations: ['user'],
      });

      if (!session || session.expiresAt <= new Date()) {
        throw new UnauthorizedException('Sessão inválida ou expirada');
      }

      return session.user;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async logout(token: string) {
    await this.sessionRepository.delete({ token });
  }

  async cleanupExpiredSessions() {
    const result = await this.sessionRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();

    return result.affected || 0;
  }
}