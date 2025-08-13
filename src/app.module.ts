import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { BloodPressureModule } from './blood-pressure/blood-pressure.module';
import { ConfigurationModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UserProfileModule,
    AuthModule,
    BloodPressureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
