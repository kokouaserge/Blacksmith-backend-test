/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly contact: string;

  @IsNotEmpty()
  readonly firstname: string;

  @IsNotEmpty()
  readonly entreprise_id: string;

  @IsNotEmpty()
  readonly lastname: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly voiture: string;

  @IsNotEmpty()
  readonly role: string;

  readonly photo?: string;
}
