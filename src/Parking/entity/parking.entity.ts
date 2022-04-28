/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PlaceParkingEntity } from '../../Place_Parking/entity/place_parking.entity';

@Entity('parkings')
export class ParkingEntity {
  @PrimaryGeneratedColumn('uuid') uuid: string;
  @Column({ type: 'varchar', nullable: false }) name: string;
  @Column({ type: 'varchar', nullable: true }) description: string;
  @Column({ type: 'varchar', nullable: false }) entreprise_id: string;
  @Column({ type: 'boolean', default: true }) active: boolean;
  @OneToMany(
    (type) => PlaceParkingEntity,
    (place_parking) => place_parking.parking_id,
  )
  places_parking: PlaceParkingEntity[];

  @CreateDateColumn() created_at?: Date;
  @CreateDateColumn() updated_at?: Date;
}
