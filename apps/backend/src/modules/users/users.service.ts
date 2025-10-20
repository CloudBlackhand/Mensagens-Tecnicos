import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'email', 'name', 'picture', 'createdAt', 'updatedAt'],
    });
  }

  async update(id: string, updateData: any) {
    await this.userRepository.update(id, {
      name: updateData.name,
      picture: updateData.picture,
      updatedAt: new Date(),
    });

    return this.findById(id);
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.userRepository.delete(id);
    return user;
  }

  async getUserStats(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['sessions'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const activeSessions = user.sessions?.filter(
      session => session.expiresAt > new Date()
    ).length || 0;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      activeSessions,
    };
  }
}