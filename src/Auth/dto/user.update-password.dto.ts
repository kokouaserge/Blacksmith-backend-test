/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class UserUpdatePasswordDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  password: string;
}
