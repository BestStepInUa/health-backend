import type { Response } from 'express';

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtAuthenticationGuard } from './guards/jwt-authentication.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';
import type { RequestWithUser } from './interfaces/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() RegisterAuthDto: RegisterAuthDto) {
    return this.authService.register(RegisterAuthDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  // eslint-disable-next-line @typescript-eslint/require-await
  async logIn(
    @Body() _loginDto: LoginAuthDto,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const { user } = request;
    console.log('user:', user);
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return response.send(userWithoutPassword);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  // eslint-disable-next-line @typescript-eslint/require-await
  async logOut(@Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
