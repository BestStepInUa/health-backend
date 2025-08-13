import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BloodPressureController } from './blood-pressure.controller';

import { BloodPressureService } from './blood-pressure.service';

import { BloodPressureRecordEntity } from './entities/blood-pressure-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BloodPressureRecordEntity])],
  controllers: [BloodPressureController],
  providers: [BloodPressureService],
})
export class BloodPressureModule {}
