import bcrypt from 'bcrypt';
import { PostgresErrorCodeEnum } from 'src/database/postgresErrorCode.enum';
import { IEnvConfig } from 'src/interfaces/envConfig.interface';
import { UserProfileResponseDto } from 'src/user-profile/dto/user-profile-response.dto';

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ACCESS_JWT } from './jwt-modules/access-token.module';
import { REFRESH_JWT } from './jwt-modules/refresh-token.module';

import { UserProfileService } from 'src/user-profile/user-profile.service';

import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ITokenPayload } from './interfaces/tokenPayload.interface';
import { IVerifyPassword } from './interfaces/verifyPassword.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userProfileService: UserProfileService,
    @Inject(ACCESS_JWT) private readonly jwtAccessService: JwtService,
    @Inject(REFRESH_JWT) private readonly jwtRefreshService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(
    RegisterAuthDto: RegisterAuthDto,
  ): Promise<UserProfileResponseDto> {
    const hashedPassword = await bcrypt.hash(RegisterAuthDto.password, 10);
    try {
      const createdUser = await this.userProfileService.createUser({
        ...RegisterAuthDto,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.code === PostgresErrorCodeEnum.UniqueViolation) {
        throw new ConflictException(
          `User with email ${RegisterAuthDto.email} already exists`,
        );
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public getCookieWithJwtAccessToken(id: number) {
    const payload: ITokenPayload = { id };
    const token = this.jwtAccessService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get<IEnvConfig['JWT_ACCESS_EXPIRES_IN']>('JWT_ACCESS_EXPIRES_IN')}`;
  }

  public getCookieWithJwtRefreshToken(id: number) {
    const payload: ITokenPayload = { id };
    const token = this.jwtRefreshService.sign(payload);
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get<IEnvConfig['JWT_REFRESH_EXPIRES_IN']>('JWT_REFRESH_EXPIRES_IN')}`;
    return {
      cookie,
      token,
    };
  }

  public async setCurrentRefreshToken(refreshToken: string, id: number) {
    await this.userProfileService.setCurrentRefreshToken(refreshToken, id);
  }

  public async removeRefreshToken(id: number) {
    await this.userProfileService.removeRefreshToken(id);
  }

  public getCookieForLogOutOrDelete() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getAuthenticatedUser({
    email,
    password,
  }: LoginAuthDto): Promise<UserProfileResponseDto> {
    try {
      const user = await this.userProfileService.findUserByEmail(email);
      await this.verifyPassword({
        password: password,
        hashedPassword: user.password,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async verifyPassword({ password, hashedPassword }: IVerifyPassword) {
    const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }
}
