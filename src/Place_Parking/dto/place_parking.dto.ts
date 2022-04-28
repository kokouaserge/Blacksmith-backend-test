/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class PlaceParkingDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  numero: string;

  @IsNotEmpty()
  etage: number;

  @IsNotEmpty()
  parking_id: string;

  @IsNotEmpty()
  active: boolean;

  created_at?: Date;
  updated_at?: Date;
}
