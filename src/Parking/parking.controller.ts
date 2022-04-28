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
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ParkingService } from './parking.service';
import { ParkingDto } from './dto/parking.dto';
import { ParkingCreateDto } from './dto/parkingCreate.dto';

@Controller('parkings')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async parkings(@Req() req: any): Promise<ParkingDto[]> {
    return await this.parkingService.findAll(req);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async parkingCreate(
    @Body() parking: ParkingCreateDto,
    @Req() req: any,
  ): Promise<ParkingDto> {
    parking.entreprise_id = req.user.entreprise_id;
    return await this.parkingService.create(parking, req);
  }

  @Get(':parking_id')
  @UseGuards(AuthGuard('jwt'))
  async parking(@Param('parking_id') parking_id: string): Promise<ParkingDto> {
    return await this.parkingService.findOne({ where: { uuid: parking_id } });
  }

  @Put(':parking_id')
  @UseGuards(AuthGuard('jwt'))
  async parkingUpdate(
    @Req() req: any,
    @Body() parking: ParkingCreateDto,
    @Param('parking_id') parking_id: string,
  ): Promise<{ StatusCode: number; message: string }> {
    return await this.parkingService.update(parking, parking_id, req);
  }

  @Delete(':parking_id')
  @UseGuards(AuthGuard('jwt'))
  async parkingDelete(
    @Req() req: any,
    @Param('parking_id') parking_id: string,
  ): Promise<{ StatusCode: number; message: string }> {
    return await this.parkingService.delete(parking_id, req);
  }
}
