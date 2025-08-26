import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IEnvConfig } from 'src/interfaces/envConfig.interface';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UserProfileService } from 'src/user-profile/user-profile.service';

import { ITokenPayload } from '../interfaces/tokenPayload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userProfileService: UserProfileService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return request?.cookies?.Refresh ?? null;
        },
      ]),
      secretOrKey:
        configService.getOrThrow<IEnvConfig['JWT_REFRESH_SECRET']>(
          'JWT_REFRESH_SECRET',
        ),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: ITokenPayload) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = request.cookies?.Refresh;
    return this.userProfileService.getUserIfRefreshTokenMatches(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      refreshToken,
      payload.id,
    );
  }
}
