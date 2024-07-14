import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { Public } from '../auth/public.decorator';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @Public() // Public cause the user need to register to have a JWT first
  async register(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @Post('login')
  @Public() // Public cause the user need to login to have their JWT
  async login(@Body() loginUserDTO: LoginUserDTO, @Res() res: Response) {
    const token = await this.authService.login(loginUserDTO);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });
    return res.status(HttpStatus.OK).send();
  }
}
