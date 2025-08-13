import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';

import { UserProfileController } from './user-profile.controller';

import { UserProfileService } from './user-profile.service';

import { UserProfileEntity } from './entities/user-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfileEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
