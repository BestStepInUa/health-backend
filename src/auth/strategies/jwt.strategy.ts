import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IEnvConfig } from 'src/interfaces/envConfig.interface';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UserProfileService } from 'src/user-profile/user-profile.service';

import { ITokenPayload } from '../interfaces/tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userProfileService: UserProfileService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return request?.cookies?.Authentication ?? null;
        },
      ]),
      secretOrKey:
        configService.getOrThrow<IEnvConfig['JWT_ACCESS_SECRET']>(
          'JWT_ACCESS_SECRET',
        ),
    });
  }

  async validate(payload: ITokenPayload) {
    return this.userProfileService.findUserById(payload.id);
  }
}
