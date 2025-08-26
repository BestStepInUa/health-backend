import { IEnvConfig } from 'src/interfaces/envConfig.interface';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

export const REFRESH_JWT = 'REFRESH_JWT_SERVICE';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<IEnvConfig['JWT_REFRESH_SECRET']>(
            'JWT_REFRESH_SECRET',
          ),
        signOptions: {
          expiresIn: configService.get<IEnvConfig['JWT_REFRESH_EXPIRES_IN']>(
            'JWT_REFRESH_EXPIRES_IN',
          ),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: REFRESH_JWT,
      useExisting: JwtService,
    },
  ],
  exports: [REFRESH_JWT],
})
export class RefreshTokenModule {}
