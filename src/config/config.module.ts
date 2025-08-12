import Joi from 'joi';
import { AppModeEnum } from 'src/interfaces/appMode.enum';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_TYPE: Joi.string().valid('postgres').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid(
            AppModeEnum.DEVELOPMENT,
            AppModeEnum.PRODUCTION,
            AppModeEnum.TEST,
          )
          .default(AppModeEnum.DEVELOPMENT),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION_TIME: Joi.string().default('15m'),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().default('7d'),
      }),
    }),
  ],
})
export class ConfigurationModule {}
