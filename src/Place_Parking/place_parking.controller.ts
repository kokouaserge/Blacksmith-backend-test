/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  Req,
  Delete,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlaceParkingService } from './place_parking.service';
import { PlaceParkingDto } from './dto/place_parking.dto';
import { PlaceParkingCreateDto } from './dto/place_parking_create.dto';
import { Assign } from './interfaces/assign.interface';
import { PlaceParkingAssignDto } from './dto/place_parking_assign.dto';

@Controller('places_parking')
export class PlaceParkingController {
  constructor(private readonly placeParkingService: PlaceParkingService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async places(@Req() req: any): Promise<PlaceParkingDto[]> {
    return await this.placeParkingService.findAll(req);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async placeCreate(
    @Body() place: PlaceParkingCreateDto,
    @Req() req: any,
  ): Promise<PlaceParkingDto> {
    return await this.placeParkingService.create(place, req);
  }

  @Get('/availables')
  @UseGuards(AuthGuard('jwt'))
  async placesAvailables(
    @Req() req: any,
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<PlaceParkingDto[]> {
    const filter = { start, end };
    return await this.placeParkingService.findAllAvailable(req, filter);
  }

  @Get('/search')
  @UseGuards(AuthGuard('jwt'))
  async searchPlaces(
    @Req() req: any,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('etage') etage: number,
  ): Promise<any> {
    const filter = { start, end, etage };
    return await this.placeParkingService.searchPlaces(filter, req);
  }

  @Get(':place_id')
  @UseGuards(AuthGuard('jwt'))
  async place(@Param('place_id') place_id: string): Promise<PlaceParkingDto> {
    return await this.placeParkingService.findOne({
      where: { uuid: place_id },
    });
  }

  @Put(':place_id')
  @UseGuards(AuthGuard('jwt'))
  async placeUpdate(
    @Req() req: any,
    @Body() place: PlaceParkingDto,
    @Param('place_id') place_id: string,
  ): Promise<{ StatusCode: number; message: string }> {
    return await this.placeParkingService.update(place, place_id, req);
  }

  @Post(':place_id')
  @UseGuards(AuthGuard('jwt'))
  async placeAssign(
    @Body() body: PlaceParkingAssignDto,
    @Param('place_id') place_id: string,
    @Query('type') type: string,
  ): Promise<{ StatusCode: number; message: string }> {
    const optionFilter: Assign = {
      start: body.start,
      end: body.end,
      type,
      place_id,
      user_id: body.user_id,
    };
    return await this.placeParkingService.assignDesassign(optionFilter);
  }

  @Delete(':place_id')
  @UseGuards(AuthGuard('jwt'))
  async placeDelete(
    @Req() req: any,
    @Param('place_id') place_id: string,
  ): Promise<{ StatusCode: number; message: string }> {
    return await this.placeParkingService.delete(place_id, req);
  }
}
