/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid') uuid: string;
  @Column({ type: 'uuid', nullable: false }) booking_id: string;
  @Column({ type: 'varchar', nullable: false }) user_id: string;
  @Column({ type: 'varchar', nullable: false }) amount_due: string;
  @Column({ type: 'varchar', nullable: false }) amount_paid: string;
  @Column({ type: 'boolean', default: true }) status: boolean;

  @CreateDateColumn() created_at?: Date;
  @CreateDateColumn() updated_at?: Date;
}
