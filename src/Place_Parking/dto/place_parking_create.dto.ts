/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class PlaceParkingCreateDto {
  @IsNotEmpty()
  numero: string;

  @IsNotEmpty()
  etage: number;

  @IsNotEmpty()
  parking_id: string;
}
