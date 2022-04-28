/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import { UserInterface } from './interfaces/user.interface';
import { userBody } from './user.controller';
//import { LoginUserDto } from './dto/user.login.dto';
//import { comparePasswords } from '../shared/utils';
//import { toUserDto } from '../shared/mapper';
//import { UserUpdatePasswordDto } from './dto/user.update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserInterface[]> {
    const users = await this.userRepo.find();

    const usersFormatClean: any = users.reduce((user) =>
      this._sanitizeUser(user),
    );

    return usersFormatClean;
  }

  async updateByType(
    type: string,
    req: any,
    user: userBody,
    user_id: string,
  ): Promise<{ StatusCode: number; message: string }> {
    const uuid = user_id;
    const { password, contact, email, firstname, lastname, photo, voiture } =
      user;
    const userCheckExist: UserEntity = await this.userRepo.findOne({
      where: { uuid },
    });

    if (!userCheckExist) {
      throw new HttpException(
        `L'utilisateur n'a pas été trouvé`,
        HttpStatus.BAD_REQUEST,
      );
    }
    switch (type) {
      case 'activation':
        if (req.user.role !== 'admin') {
          throw new HttpException(
            'Pas de droit néccessaire pour cette action',
            HttpStatus.UNAUTHORIZED,
          );
        }

        await this.userRepo.update({ uuid }, { active: true });

        break;
      case 'change_password':
        if (req.user.uuid !== uuid) {
          throw new HttpException(
            'Pas de droit néccessaire pour cette action',
            HttpStatus.UNAUTHORIZED,
          );
        }

        await this.userRepo.update({ uuid }, { password });
        break;
      case 'change_user_data':
        if (req.user.uuid !== uuid && req.user.role !== 'admin') {
          throw new HttpException(
            'Pas de droit néccessaire pour cette action',
            HttpStatus.UNAUTHORIZED,
          );
        }

        if (userCheckExist.contact !== contact) {
          const userCheckContactExist: UserEntity = await this.userRepo.findOne(
            {
              where: { contact },
            },
          );

          if (userCheckContactExist) {
            throw new HttpException(
              `Contact exist deja`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }

        if (userCheckExist.email !== email) {
          const userCheckEmailExist: UserEntity = await this.userRepo.findOne({
            where: { email },
          });

          if (userCheckEmailExist) {
            throw new HttpException(`Email exist deja`, HttpStatus.BAD_REQUEST);
          }
        }

        const userUpdate = {
          firstname,
          lastname,
          contact,
          email,
          photo,
          voiture,
        };

        await this.userRepo.update({ uuid }, userUpdate);
        break;
    }

    return { StatusCode: 200, message: 'Modifiée avec succès' };
  }

  async findOne(options?: object): Promise<UserDto> {
    const user = await this.userRepo.findOne(options);

    if (!user) {
      throw new HttpException(
        'Utilisateur non trouvé',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async deleteUser(
    uuid: string,
    req: any,
  ): Promise<{ StatusCode: number; message: string }> {
    if (req.user.uuid !== uuid && req.user.role !== 'admin') {
      throw new HttpException(
        'Pas de droit néccessaire pour cette action',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userCheckExist: UserEntity = await this.userRepo.findOne({
      where: { uuid },
    });

    if (!userCheckExist) {
      throw new HttpException(
        `L'utilisateur n'a pas été trouvé`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepo.delete(uuid);

    return { StatusCode: 200, message: 'Supprimé avec succès' };
  }

  private _sanitizeUser(user: UserEntity) {
    delete user.password;
    delete user.reset_password_expires;
    delete user.active_token;
    return user;
  }
}
