import cookieParser from 'cookie-parser';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';

import { IEnvConfig } from './interfaces/envConfig.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const port = configService.get<IEnvConfig['PORT']>('PORT', 3000);

  console.log(`🚀 Server is running on port ${port}`);
  await app.listen(port);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start the application:', error);
  process.exit(1);
});
