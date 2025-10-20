import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findAll() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, updateData: any) {
    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        name: updateData.name,
        picture: updateData.picture,
        updatedAt: new Date(),
      },
    });

    return user;
  }

  async delete(id: string) {
    // Primeiro deletar todas as sessões do usuário
    await this.prismaService.session.deleteMany({
      where: { userId: id },
    });

    // Depois deletar o usuário
    const user = await this.prismaService.user.delete({
      where: { id },
    });

    return user;
  }

  async getUserStats(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        sessions: {
          where: {
            expiresAt: {
              gt: new Date(),
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      activeSessions: user.sessions.length,
    };
  }
}
