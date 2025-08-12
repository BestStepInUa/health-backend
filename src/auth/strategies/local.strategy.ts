import { Strategy } from 'passport-local';
import { UserProfileResponseDto } from 'src/user-profile/dto/user-profile-response.dto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

import { LoginAuthDto } from '../dto/login-auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate({
    email,
    password,
  }: LoginAuthDto): Promise<UserProfileResponseDto> {
    const user = await this.authService.getAuthenticatedUser({
      email,
      password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
