/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ParkingEntity } from '../../Parking/entity/parking.entity';

@Entity('place_parkings')
export class PlaceParkingEntity {
  @PrimaryGeneratedColumn('uuid') uuid: string;
  @Column({ type: 'varchar', nullable: false, unique: true }) numero: string;
  @Column({ type: 'integer', nullable: false }) etage: number;
  @Column({ type: 'uuid', nullable: false }) parking_id: string;
  @Column({ type: 'boolean', default: true }) active: boolean;

  @ManyToOne(() => ParkingEntity, (parking) => parking.uuid)
  parking: ParkingEntity;

  @CreateDateColumn() created_at?: Date;
  @CreateDateColumn() updated_at?: Date;
}
