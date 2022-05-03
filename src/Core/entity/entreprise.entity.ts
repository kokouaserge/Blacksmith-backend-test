/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('entreprises')
export class EntrepriseEntity {
  @PrimaryGeneratedColumn('uuid') uuid: string;
  @Column({ type: 'varchar', nullable: false }) name: string;
  @Column({ type: 'boolean', default: true }) status: boolean;

  @CreateDateColumn() created_at?: Date;
  @CreateDateColumn() updated_at?: Date;
}
