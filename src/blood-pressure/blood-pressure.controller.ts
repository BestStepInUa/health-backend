import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/interfaces/requestWithUser.interface';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BloodPressureService } from './blood-pressure.service';

import { CreateBloodPressureRecordDto } from './dto/create-blood-pressure-record.dto';
import { UpdateBloodPressureRecordDto } from './dto/update-blood-pressure-record.dto';

@Controller('blood-pressure')
@UseGuards(JwtAuthGuard)
export class BloodPressureController {
  constructor(private readonly bloodPressureService: BloodPressureService) {}

  @Post()
  async createRecord(
    @Req() request: RequestWithUser,
    @Body() dto: CreateBloodPressureRecordDto,
  ) {
    return this.bloodPressureService.createBloodPressureRecord(
      request.user,
      dto,
    );
  }

  @Get()
  async findAllRecords(@Req() request: RequestWithUser) {
    return this.bloodPressureService.findAllRecordsByUserId(request.user.id);
  }

  @Get(':id')
  async findOneRecord(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bloodPressureService.findRecordByIdAndUserId(
      id,
      request.user.id,
    );
  }

  @Patch(':id')
  async updateRecord(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBloodPressureRecordDto: UpdateBloodPressureRecordDto,
    @Req() request: RequestWithUser,
  ) {
    return this.bloodPressureService.updateRecordByIdAndUserId(
      id,
      updateBloodPressureRecordDto,
      request.user.id,
    );
  }

  @Delete(':id')
  async deleteRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
  ) {
    await this.bloodPressureService.deleteRecord(id, request.user.id);
    return { message: 'Record deleted successfully' };
  }
}
