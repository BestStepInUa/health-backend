import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [ConfigurationModule, DatabaseModule, UserProfileModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
