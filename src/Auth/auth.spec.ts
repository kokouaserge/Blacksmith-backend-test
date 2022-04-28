/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController test unit', () => {
  let controller: AuthController;
  const mockServiceAuth = {
    login: jest.fn((dto) => {
      if (dto.email !== 'kokouaserge3@gmail.com')
        return {
          statusCode: 401,
          message: 'Error de email',
        };
      return {
        uuid: 'jdhdgfbfbfks8595',
        expiresIn: '',
        accessToken: '',
      };
    }),

    register: jest.fn().mockImplementation((dto) => {
      if (
        dto.email == 'kokouaserge3@gmail.com' ||
        dto.contact == '0788598217'
      ) {
        return Promise.resolve({
          statusCode: 401,
          message: 'User already exists with email or contact',
        });
      }
      return Promise.resolve({ success: true, message: 'user registered' });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockServiceAuth)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be return login connect', async () => {
    const reponse = await controller.login({
      email: 'kokouaserge3@gmail.com',
      password: 'test',
    });
    expect(reponse).toEqual(
      expect.objectContaining({
        uuid: expect.any(String),
        expiresIn: expect.any(String),
        accessToken: expect.any(String),
      }),
    );
  });

  it('should be return error connect email login connect', async () => {
    const reponse = await controller.login({
      email: 'kokouserge3@gmail.com',
      password: 'test',
    });
    expect(reponse).toEqual(
      expect.objectContaining({
        statusCode: expect.any(Number),
        message: expect.any(String),
      }),
    );
  });

  it('should return create', async () => {
    const dto = {
      firstname: 'KOKOUA',
      lastname: 'Serge',
      contact: 'contact',
      email: 'email@gmail.com',
      password: 'test',
      entreprise_id: 'djdjdhhf-fjfhgfgd',
      voiture: '4*4',
    };
    const response = await controller.register(dto);

    expect(response).toEqual(
      expect.objectContaining({
        success: true,
        message: 'user registered',
      }),
    );
  });

  it('should return create error', async () => {
    const dto = {
      firstname: 'KOKOUA',
      lastname: 'Serge',
      contact: '0788598217',
      email: 'kokouaserge3@gmail.com',
      password: 'test',
      entreprise_id: 'djdjdhhf-fjfhgfgd',
      voiture: '4*4',
    };
    const response = await controller.register(dto);

    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 401,
        message: 'User already exists with email or contact',
      }),
    );
  });
});
