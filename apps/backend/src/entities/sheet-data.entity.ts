import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sheet_data')
export class SheetData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sheetId: string;

  @Column('jsonb')
  data: any;

  @CreateDateColumn()
  lastSync: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
