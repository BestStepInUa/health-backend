import { UserProfileEntity } from 'src/user-profile/entities/user-profile.entity';
import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBloodPressureRecordDto } from './dto/create-blood-pressure-record.dto';
import { UpdateBloodPressureRecordDto } from './dto/update-blood-pressure-record.dto';
import { BloodPressureRecordEntity } from './entities/blood-pressure-record.entity';

@Injectable()
export class BloodPressureService {
  constructor(
    @InjectRepository(BloodPressureRecordEntity)
    private readonly bloodPressureRepository: Repository<BloodPressureRecordEntity>,
  ) {}

  async createBloodPressureRecord(
    user: UserProfileEntity,
    createBloodPressureRecordDto: CreateBloodPressureRecordDto,
  ): Promise<BloodPressureRecordEntity> {
    const record = this.bloodPressureRepository.create({
      ...createBloodPressureRecordDto,
      user,
      timestamp: createBloodPressureRecordDto.timestamp ?? new Date(),
    });
    return this.bloodPressureRepository.save(record);
  }

  async findAllRecordsByUserId(
    id: number,
  ): Promise<BloodPressureRecordEntity[]> {
    return this.bloodPressureRepository.find({
      where: { user: { id } },
      order: { timestamp: 'DESC' },
    });
  }

  async findRecordByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<BloodPressureRecordEntity> {
    const record = await this.bloodPressureRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }

  async updateRecordByIdAndUserId(
    id: number,
    updateBloodPressureRecordDto: UpdateBloodPressureRecordDto,
    userId: number,
  ): Promise<BloodPressureRecordEntity> {
    const record = await this.findRecordByIdAndUserId(id, userId);
    Object.assign(record, updateBloodPressureRecordDto);
    return this.bloodPressureRepository.save(record);
  }

  async deleteRecord(id: number, userId: number): Promise<void> {
    const record = await this.findRecordByIdAndUserId(id, userId);
    await this.bloodPressureRepository.remove(record);
  }
}
