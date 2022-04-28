/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class ParkingCreateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  entreprise_id: string;

  @IsNotEmpty()
  description: string;
}
