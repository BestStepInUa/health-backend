import { IEnvConfig } from 'src/interfaces/envConfig.interface';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

export const ACCESS_JWT = 'ACCESS_JWT_SERVICE';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<IEnvConfig['JWT_ACCESS_SECRET']>(
            'JWT_ACCESS_SECRET',
          ),
        signOptions: {
          expiresIn: configService.get<IEnvConfig['JWT_ACCESS_EXPIRES_IN']>(
            'JWT_ACCESS_EXPIRES_IN',
          ),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: ACCESS_JWT,
      useExisting: JwtService,
    },
  ],
  exports: [ACCESS_JWT],
})
export class AccessTokenModule {}
