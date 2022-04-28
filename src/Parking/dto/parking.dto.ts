/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class ParkingDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  entreprise_id: string;

  description?: string;

  @IsNotEmpty()
  active: boolean;

  places_parking?: any;

  created_at?: Date;
  updated_at?: Date;
}
