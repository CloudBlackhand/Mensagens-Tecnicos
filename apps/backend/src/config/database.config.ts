import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import { SheetData } from '../entities/sheet-data.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Session, SheetData],
  synchronize: process.env.NODE_ENV !== 'production', // Apenas em desenvolvimento
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};
