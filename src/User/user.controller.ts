/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  Delete,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserInterface } from './interfaces/user.interface';

export interface userBody {
  uuid: string;
  password: string;
  contact: string;
  email: string;
  firstname: string;
  lastname: string;
  photo: string;
  voiture: string;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async users(): Promise<UserInterface[]> {
    return await this.userService.findAll();
  }

  @Get(':user_id')
  @UseGuards(AuthGuard('jwt'))
  async user(@Param('user_id') user_id: string) {
    return await this.userService.findOne({ where: { uuid: user_id } });
  }

  @Put(':user_id')
  @UseGuards(AuthGuard('jwt'))
  async userUpdate(
    @Query('type') type: string,
    @Req() req: any,
    @Body() user: userBody,
    @Param('user_id') user_id: string,
  ): Promise<any> {
    return await this.userService.updateByType(type, req, user, user_id);
  }

  @Delete(':user_id')
  @UseGuards(AuthGuard('jwt'))
  async userDelete(@Req() req: any, @Param('user_id') user_id: string) {
    return await this.userService.deleteUser(user_id, req);
  }
}
