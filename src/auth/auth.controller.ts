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
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
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
  async logIn(
    @Body() _loginDto: LoginAuthDto,
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );
    await this.authService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );
    response.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password: _password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentHashedRefreshToken: _currentHashedRefreshToken,
      ...userWithoutPassword
    } = user;
    return userWithoutPassword;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  async refresh(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );
    await this.authService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );
    response.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password: _password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentHashedRefreshToken: _currentHashedRefreshToken,
      ...userWithoutPassword
    } = user;
    return userWithoutPassword;
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(
    @Req() _request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.removeRefreshToken(_request.user.id);
    response.setHeader(
      'Set-Cookie',
      this.authService.getCookieForLogOutOrDelete(),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password: _password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentHashedRefreshToken: _currentHashedRefreshToken,
      ...userWithoutPassword
    } = user;
    return userWithoutPassword;
  }
}
