/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('booking_places')
export class PlaceParkingEntity {
  @PrimaryGeneratedColumn('uuid') uuid: string;
  @Column({ type: 'uuid', nullable: false }) place_parking_id: string;
  @Column({ type: 'varchar', nullable: false }) user_id: string;
  @Column({ type: 'varchar', nullable: false }) start_of_booking: string;
  @Column({ type: 'varchar', nullable: false }) end_of_booking: string;
  @Column({ type: 'boolean', default: true }) status: boolean;

  @CreateDateColumn() created_at?: Date;
  @CreateDateColumn() updated_at?: Date;
}
