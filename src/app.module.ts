import Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserProfileModule } from './user-profile/user-profile.module';

import { envConfig } from './interfaces/envConfig.interface';

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
          .valid('development', 'production', 'test')
          .default('development'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<envConfig['DB_TYPE']>('DB_TYPE'),
        host: configService.get<envConfig['DB_HOST']>('DB_HOST'),
        port: configService.get<envConfig['DB_PORT']>('DB_PORT'),
        username: configService.get<envConfig['DB_USERNAME']>('DB_USERNAME'),
        password: configService.get<envConfig['DB_PASSWORD']>('DB_PASSWORD'),
        database: configService.get<envConfig['DB_DATABASE']>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize:
          configService.get<envConfig['NODE_ENV']>('NODE_ENV') ===
          'development',
      }),
    }),
    UserProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
