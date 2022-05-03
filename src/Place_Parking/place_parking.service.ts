/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PlaceParkingDto } from './dto/place_parking.dto';
import { PlaceParkingCreateDto } from './dto/place_parking_create.dto';
import { PlaceParkingEntity } from './entity/place_parking.entity';
import { Assign } from './interfaces/assign.interface';

@Injectable()
export class PlaceParkingService {
  constructor(
    @InjectRepository(PlaceParkingEntity)
    private readonly placeParkingRepo: Repository<PlaceParkingEntity>,
  ) {}

  async findAll(req: any): Promise<PlaceParkingDto[]> {
    const parkings = await this.placeParkingRepo.query(
      'SELECT * FROM parkings WHERE entreprise_id = $1',
      [req.user.entreprise_id],
    );

    const parkingsIDArray = parkings.reduce((parking) => parking.uuid);

    const places = this.placeParkingRepo.find({
      where: { parking_id: In[parkingsIDArray] },
    });
    return places;
  }

  async findOne(options?: object): Promise<PlaceParkingDto> {
    const place = await this.placeParkingRepo.findOne(options);

    if (!place) {
      throw new HttpException(
        'Place de Parking non trouvé',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return place;
  }

  async create(
    place: PlaceParkingCreateDto,
    req: any,
  ): Promise<PlaceParkingDto> {
    if (req.user.role !== 'admin') {
      throw new HttpException(
        'Pas de droit néccessaire pour cette action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { numero, etage, parking_id } = place;
    let newParking_id = parking_id;

    if (parking_id === 'default') {
      const parkings = await this.placeParkingRepo.query(
        'SELECT * FROM parkings WHERE entreprise_id = $1',
        [req.user.entreprise_id],
      );

      newParking_id = parkings[0].uuid;
    }
    const placeParkingCreate: PlaceParkingEntity =
      await this.placeParkingRepo.create({
        numero,
        etage,
        parking_id: newParking_id,
      });

    const newPlaceParking = await this.placeParkingRepo.save(
      placeParkingCreate,
    );
    return newPlaceParking;
  }

  async update(
    place: PlaceParkingCreateDto,
    uuid: string,
    req: any,
  ): Promise<{ StatusCode: number; message: string }> {
    if (req.user.role !== 'admin') {
      throw new HttpException(
        'Pas de droit néccessaire pour cette action',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.placeParkingRepo.update({ uuid }, place);
    return { StatusCode: 200, message: 'Modifié avec succès' };
  }

  async assignDesassign(options: Assign) {
    const place_parking = await this.findOne({
      where: { uuid: options.place_id },
    });

    if (!place_parking) {
      throw new HttpException(
        'Place de Parking non trouvé',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const availables = await this.checkAvailablePlace(options);

    const checkIfUserNotAlreadyBooking = await this.placeParkingRepo.query(
      'SELECT * FROM booking_places WHERE user_id = $3  AND status = true AND ((start_of_booking >= $1 AND end_of_booking <= $2) ' +
        ' OR (start_of_booking <= $1 AND end_of_booking >= $2) OR ' +
        '(start_of_booking <= $2 AND end_of_booking >= $2) )',
      [options.start, options.end, options.user_id],
    );

    if (
      (availables.length > 0 || checkIfUserNotAlreadyBooking.length > 0) &&
      options.type === 'ASSIGN'
    ) {
      console.log(checkIfUserNotAlreadyBooking);
      throw new HttpException('Déja reservé', HttpStatus.UNAUTHORIZED);
    }

    const arrayType = ['ASSIGN', 'DESASSIGN'];

    if (!arrayType.includes(options.type)) {
      throw new HttpException(
        `Le type d'action n'est pas correcte`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    switch (options.type) {
      case 'ASSIGN':
        await this.placeParkingRepo.query(
          'INSERT INTO booking_places (place_parking_id, user_id, start_of_booking, end_of_booking)' +
            ' VALUES ($1, $2, $3, $4)',
          [options.place_id, options.user_id, options.start, options.end],
        );
        break;

      case 'DESASSIGN':
        await this.placeParkingRepo.query(
          'UPDATE booking_places SET status = false WHERE  place_parking_id = $1 AND user_id = $2' +
            ' AND start_of_booking = $3 AND end_of_booking = $4',
          [options.place_id, options.user_id, options.start, options.end],
        );

        break;
    }

    return { StatusCode: 200, message: 'Modifiée avec succès' };
  }

  async searchPlaces(
    filter: { etage: number; start: string; end: string },
    req: any,
  ) {
    const placesFull = await this.findAll(req);

    const places = !!filter.etage
      ? placesFull.filter((place) => place.etage === filter.etage)
      : placesFull;

    const placesAvailable = [];

    for (const place of places) {
      const filterForAVailable: any = filter;
      filterForAVailable.place_id = place.uuid;
      const availables = await this.checkAvailablePlace(filterForAVailable);

      if (availables.length === 0) placesAvailable.push(place);
    }

    return placesAvailable;
  }

  async findAllAvailable(
    req: any,
    filter: { start: string; end: string },
  ): Promise<PlaceParkingDto[]> {
    const places = await this.findAll(req);

    const placesAvailable = [];

    for (const place of places) {
      const filterForAVailable: any = filter;
      filterForAVailable.place_id = place.uuid;
      const availables = await this.checkAvailablePlace(filterForAVailable);

      if (availables.length === 0) placesAvailable.push(place);
    }
    return placesAvailable;
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

    await this.placeParkingRepo.delete(uuid);
    return { StatusCode: 200, message: 'Supprimé avec succès' };
  }

  private async checkAvailablePlace(options: {
    start: string;
    end: string;
    place_id: string;
    etage?: number;
  }) {
    const availables = await this.placeParkingRepo.query(
      'SELECT * FROM booking_places WHERE status = true AND place_parking_id = $3 AND ((start_of_booking >= $1 AND end_of_booking <= $2 )' +
        ' OR (start_of_booking <= $1 AND end_of_booking >= $2) OR ' +
        '(start_of_booking <= $2 AND end_of_booking >= $2) )',
      [options.start, options.end, options.place_id],
    );

    return availables;
  }
}
