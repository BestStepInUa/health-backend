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

  async createUser(dto: CreateUserProfileDto): Promise<UserProfileResponseDto> {
    const isAlreadyExists = await this.userProfileRepository.findOne({
      where: [{ email: dto.email }],
    });

    if (isAlreadyExists) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const userProfile = this.userProfileRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const savedUser = await this.userProfileRepository.save(userProfile);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  async findUserById(id: number): Promise<UserProfileResponseDto> {
    const user = await this.userProfileRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findAllUsers(): Promise<UserProfileResponseDto[]> {
    return this.userProfileRepository.find();
  }

  async updateUserById(
    id: number,
    dto: UpdateUserProfileDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.userProfileRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userProfileRepository.findOne({
        where: { email: dto.email },
      });
      if (emailExists)
        throw new ConflictException(
          `Current email ${dto.email} is already in use`,
        );
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);

    const updatedUser = await this.userProfileRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async deleteUserById(id: number): Promise<void> {
    const result = await this.userProfileRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
