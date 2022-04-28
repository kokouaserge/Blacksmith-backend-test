/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') uuid: string;
  @Column({ type: 'varchar', nullable: false }) firstname: string;
  @Column({ type: 'varchar', nullable: false }) lastname: string;
  @Column({ type: 'varchar', nullable: false }) password: string;
  @Column({ type: 'varchar', nullable: false, unique: true }) contact: string;
  @Column({ type: 'varchar', nullable: false, unique: true }) email: string;
  @Column({ type: 'varchar', nullable: false }) role: string;
  @Column({ type: 'varchar', nullable: false }) entreprise_id: string;

  @Column({ type: 'varchar', nullable: true }) voiture: string;
  @Column({ type: 'varchar', nullable: true }) statut: string;
  @Column({ type: 'text', nullable: true }) photo: string;
  @Column({ type: 'varchar', nullable: true }) reset_password_token: string;
  @Column({ type: 'boolean', default: true }) active: boolean;
  @Column({ type: 'text', nullable: true }) active_token: string;

  @CreateDateColumn() reset_password_expires?: Date;

  @CreateDateColumn() created_at?: Date;
  @CreateDateColumn() updated_at?: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
