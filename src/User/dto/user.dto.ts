/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  contact: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  active: boolean;

  voiture: string;
  statut?: string;
  photo?: string;
  entreprise_id: string;
  reset_password_token?: string;
  active_token?: string;
  reset_password_expires?: Date;
  created_at?: Date;
  updated_at?: Date;
}
