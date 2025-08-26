import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AccessTokenModule } from './jwt-modules/access-token.module';
import { RefreshTokenModule } from './jwt-modules/refresh-token.module';
import { UserProfileModule } from 'src/user-profile/user-profile.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { JwtAccessTokenStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    forwardRef(() => UserProfileModule),
    PassportModule,
    AccessTokenModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
