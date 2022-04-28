/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingDto } from './dto/parking.dto';
import { ParkingCreateDto } from './dto/parkingCreate.dto';
import { ParkingEntity } from './entity/parking.entity';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(ParkingEntity)
    private readonly parkingRepo: Repository<ParkingEntity>,
  ) {}

  async findAll(req: any): Promise<ParkingDto[]> {
    const parkings = await this.parkingRepo.find({
      where: { entreprise_id: req.user.entreprise_id },
    });

    return parkings;
  }
  async findOne(options?: object): Promise<ParkingDto> {
    const parking = await this.parkingRepo.findOne(options);

    if (!parking) {
      throw new HttpException('Parking non trouvé', HttpStatus.UNAUTHORIZED);
    }

    return parking;
  }

  async create(parking: ParkingCreateDto, req: any): Promise<ParkingDto> {
    if (req.user.role !== 'admin') {
      throw new HttpException(
        'Pas de droit néccessaire pour cette action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const parkingCreate: ParkingEntity = await this.parkingRepo.create(parking);

    const newParking = await this.parkingRepo.save(parkingCreate);
    return newParking;
  }

  async update(
    parking: ParkingCreateDto,
    uuid: string,
    req: any,
  ): Promise<{ StatusCode: number; message: string }> {
    if (req.user.role !== 'admin') {
      throw new HttpException(
        'Pas de droit néccessaire pour cette action',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.parkingRepo.update({ uuid }, parking);
    return { StatusCode: 200, message: 'Modifié avec succès' };
  }

  async delete(
    uuid: string,
    req: any,
  ): Promise<{ StatusCode: number; message: string }> {
    if (req.user.role !== 'admin') {
      throw new HttpException(
        'Pas de droit néccessaire pour cette action',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const places_parking = await this.parkingRepo.query(
      'SELECT * FROM place_parkings WHERE parking_id = $1 ',
      [uuid],
    );

    for (const place of places_parking) {
      await this.parkingRepo.query(
        'DELETE FROM place_parkings WHERE parking_id = $1 ',
        [place.uuid],
      );
    }

    await this.parkingRepo.delete(uuid);
    return { StatusCode: 200, message: 'Supprimé avec succès' };
  }
}
