/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PlaceParkingService } from './place_parking.service';
import { PlaceParkingEntity } from './entity/place_parking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceParkingController } from './place_parking.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([PlaceParkingEntity]),
    AuthModule,
  ],
  providers: [PlaceParkingService],
  exports: [],
  controllers: [PlaceParkingController],
})
export class PlaceParkingModule {}
