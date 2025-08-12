import { AppModeEnum } from 'src/interfaces/appMode.enum';
import { IEnvConfig } from 'src/interfaces/envConfig.interface';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<IEnvConfig['DB_TYPE']>('DB_TYPE'),
        host: configService.get<IEnvConfig['DB_HOST']>('DB_HOST'),
        port: configService.get<IEnvConfig['DB_PORT']>('DB_PORT'),
        username: configService.get<IEnvConfig['DB_USERNAME']>('DB_USERNAME'),
        password: configService.get<IEnvConfig['DB_PASSWORD']>('DB_PASSWORD'),
        database: configService.get<IEnvConfig['DB_DATABASE']>('DB_DATABASE'),
        autoLoadEntities: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize:
          configService.get<IEnvConfig['NODE_ENV']>('NODE_ENV') ===
          AppModeEnum.DEVELOPMENT,
      }),
    }),
  ],
})
export class DatabaseModule {}
