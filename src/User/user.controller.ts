/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Delete,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/user.create.dto';

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

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async userCreate(
    @Body() createUserDto: CreateUserDto,
    @Req() req: any,
  ): Promise<{ success: boolean; message: string }> {
    return await this.userService.register(createUserDto, req);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async users(): Promise<UserEntity[]> {
    console.log('Enter');
    return await this.userService.findAll();
  }

  @Get('/account')
  @UseGuards(AuthGuard('jwt'))
  async userPersonnal(@Req() req: any): Promise<any> {
    const uuid = req.user.uuid;
    const user = await this.userService.findOne({ where: { uuid } });

    delete user['password'];
    delete user['reset_password_token'];
    delete user['reset_password_expires'];
    delete user['active_token'];

    return user;
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
