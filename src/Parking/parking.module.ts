/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingEntity } from './entity/parking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingController } from './parking.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([ParkingEntity]),
    AuthModule,
  ],
  providers: [ParkingService],
  exports: [],
  controllers: [ParkingController],
})
export class ParkingModule {}
