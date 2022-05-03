/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.create.dto';
import { UserDto } from '../User/dto/user.dto';
import { UserEntity } from '../User/entity/user.entity';
import { LoginUserDto } from './dto/user.login.dto';
import { LoginStatus } from './interfaces/login-status.interface';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async login({ email, password }: LoginUserDto): Promise<LoginStatus> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        "Il existe pas d'utilisateur avec cet email dans notre base",
        HttpStatus.UNAUTHORIZED,
      );
    }

    // compare passwords
    const areEqual = await this.comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException(
        'Mot de passe Incorrecte',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // generate and sign token
    const token = this._createToken(user);

    return {
      user: user,
      role: user.role,
      ...token,
    };
  }

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    const {
      email,
      contact,
      firstname,
      lastname,
      password,
      entreprise_id,
      voiture,
      role,
    } = userDto;

    // check if the user exists in the db
    const userEmailInDb = await this.userRepo.findOne({ where: { email } });
    const userContactInDb = await this.userRepo.findOne({ where: { contact } });
    if (userEmailInDb || userContactInDb) {
      const msg = userEmailInDb
        ? userContactInDb
          ? `L'adresse email et le contact sont déjà utilisés`
          : `L'adresse email est déjà utilisée`
        : `Le contact est déjà utilisé`;
      throw new HttpException(`${msg}`, HttpStatus.UNAUTHORIZED);
    }
    const user: UserEntity = await this.userRepo.create({
      email,
      contact,
      firstname,
      lastname,
      password,
      entreprise_id,
      voiture,
      role,
    });

    await this.userRepo.save(user);
    return {
      success: true,
      message: "Enregister avec succès en attente d'activation",
    };
  }

  async findByPayload({ email }: any): Promise<UserDto> {
    return await this.findOne({ where: { email } });
  }

  async findOne(options?: object): Promise<UserDto> {
    return await this.userRepo.findOne(options);
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async comparePasswords(userPassword: string, currentPassword: string) {
    return await bcrypt.compare(currentPassword, userPassword);
  }

  private _createToken({ email }: UserDto): any {
    const expiresIn = process.env.EXPIRESIN;

    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn,
      accessToken,
    };
  }
}
