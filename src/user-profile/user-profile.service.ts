import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserProfileEntity } from './entities/user-profile.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  async createUser(
    CreateUserProfileDto: CreateUserProfileDto,
  ): Promise<UserProfileResponseDto> {
    const newUser = this.userProfileRepository.create(CreateUserProfileDto);

    const savedUser = await this.userProfileRepository.save(newUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = savedUser;

    return savedUser;
  }

  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userProfileRepository.update(id, {
      currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(id: number) {
    return this.userProfileRepository.update(id, {
      currentHashedRefreshToken: null,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.findUserById(id);
    if (!user.currentHashedRefreshToken) return undefined;

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async findUserById(id: number): Promise<UserProfileEntity> {
    const user = await this.userProfileRepository.findOne({
      where: { id },
      select: ['id', 'login', 'email', 'password', 'currentHashedRefreshToken'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserProfileEntity> {
    const user = await this.userProfileRepository.findOne({
      where: { email },
      select: ['id', 'login', 'email', 'password'],
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findAllUsers(): Promise<UserProfileResponseDto[]> {
    return this.userProfileRepository.find();
  }

  async updateUserById(
    id: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.findUserById(id);

    if (
      updateUserProfileDto.email &&
      updateUserProfileDto.email !== user.email
    ) {
      const emailExists = await this.userProfileRepository.findOne({
        where: { email: updateUserProfileDto.email },
      });
      if (emailExists)
        throw new ConflictException(
          `Current email ${updateUserProfileDto.email} is already in use`,
        );
    }

    if (updateUserProfileDto.password) {
      updateUserProfileDto.password = await this.hashPassword(
        updateUserProfileDto.password,
      );
    }

    Object.assign(user, updateUserProfileDto);

    const updatedUser = await this.userProfileRepository.save(user);

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password: _password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentHashedRefreshToken: _currentHashedRefreshToken,
      ...userWithoutPassword
    } = updatedUser;

    return userWithoutPassword;
  }

  async deleteUserById(id: number): Promise<void> {
    const result = await this.userProfileRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
