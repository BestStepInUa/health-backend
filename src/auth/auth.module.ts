import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AccessTokenModule } from './jwt-modules/access-token.module';
import { UserProfileModule } from 'src/user-profile/user-profile.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UserProfileModule, PassportModule, AccessTokenModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
