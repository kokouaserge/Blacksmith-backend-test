/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([UserEntity]), AuthModule],
  providers: [UserService],
  exports: [],
  controllers: [UserController],
})
export class UserModule {}
