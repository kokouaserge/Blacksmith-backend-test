/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class PlaceParkingAssignDto {
  @IsNotEmpty()
  start: string;

  @IsNotEmpty()
  end: string;

  @IsNotEmpty()
  user_id: string;
}
