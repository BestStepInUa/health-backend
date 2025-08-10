import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { envConfig } from './interfaces/envConfig.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<envConfig['PORT']>('PORT', 3000);

  console.log(`🚀 Server is running on port ${port}`);
  await app.listen(port);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start the application:', error);
  process.exit(1);
});
