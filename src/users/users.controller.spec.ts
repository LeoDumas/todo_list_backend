import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { Users } from './schemas/users.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: getModelToken('Users'),
          useValue: Model,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call userService.create with the correct parameters', async () => {
      const createUserDTO: CreateUserDTO = {
        email: 'test@email.com',
        username: 'testUsername12',
        password: 'test',
      };
      await controller.register(createUserDTO);
      expect(userService.create).toHaveBeenCalledWith(createUserDTO);
    });

    it('should return the created user', async () => {
      const createUserDTO: CreateUserDTO = {
        email: 'test@email.com',
        username: 'testUsername12',
        password: 'test',
      };
      const createdUser = {
        _id: '1',
        ...createUserDTO,
        $assertPopulated: jest.fn(),
        $clearModifiedPaths: jest.fn(),
        $clone: jest.fn(),
        $createModifiedPathsSnapshot: jest.fn(),
      } as unknown as Users;

      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

      const result = await controller.register(createUserDTO);
      expect(result).toBe(createdUser);
    });
  });

  describe('login', () => {
    it('should call authService.login and set a cookie', async () => {
      const loginUserDTO: LoginUserDTO = {
        email: 'test@email.com',
        password: 'test',
      };
      const token = 'testToken';
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      jest.spyOn(authService, 'login').mockResolvedValue(token);

      await controller.login(loginUserDTO, res);

      expect(authService.login).toHaveBeenCalledWith(loginUserDTO);
      expect(res.cookie).toHaveBeenCalledWith('jwt', token, {
        httpOnly: false,
        secure: false,
        maxAge: 3600000,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return an unauthorized error if login fails', async () => {
      const loginUserDTO: LoginUserDTO = {
        email: 'test@email.com',
        password: 'wrongpassword',
      };
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException());

      try {
        await controller.login(loginUserDTO, res);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }

      expect(authService.login).toHaveBeenCalledWith(loginUserDTO);
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });
});
