/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntrepriseEntity } from './entity/entreprise.entity';

@Injectable()
export class CoreService {
  constructor(
    @InjectRepository(EntrepriseEntity)
    private readonly entrepriseRepo: Repository<EntrepriseEntity>,
  ) {}

  async createEntreprise(userDto: {
    email: string;
    name: string;
    contact: string;
    password: string;
    firstname: string;
    lastname: string;
    description: string;
  }) {
    const { email, contact, firstname, lastname, password, name, description } =
      userDto;

    const entrepriseCreate: EntrepriseEntity = await this.entrepriseRepo.create(
      {
        name,
      },
    );

    const newEntreprise = await this.entrepriseRepo.save(entrepriseCreate);

    // check if the user exists in the db
    const userEmailOrContactInDb = await this.entrepriseRepo.query(
      'SELECT * FROM users WHERE email = $1 OR contact = $2',
      [email, contact],
    );

    if (!!userEmailOrContactInDb && userEmailOrContactInDb.length > 0) {
      const msg = `L'adresse email ou le contact est déjà utilisés`;
      throw new HttpException(`${msg}`, HttpStatus.BAD_REQUEST);
    }

    await this.entrepriseRepo.query(
      `INSERT INTO users(firstname, lastname, contact,
                                 email, password, entreprise_id, voiture, role) VALUES($1, $2, $3, 
                                    $4, $5, $6, $7, $8)`,
      [
        firstname,
        lastname,
        contact,
        email,
        password,
        newEntreprise.uuid,
        'test',
        'admin',
      ],
    );

    await this.entrepriseRepo.query(
      `INSERT INTO parkings(name,description, entreprise_id) VALUES($1, $2, $3)`,
      [name, description, newEntreprise.uuid],
    );

    return {
      success: true,
      message: "Enregister avec succès en attente d'activation",
    };
  }
}
