import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UserProfileService } from './user-profile.service';

import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  createUser(@Body() CreateUserProfileDto: CreateUserProfileDto) {
    return this.userProfileService.createUser(CreateUserProfileDto);
  }

  @Get(':id')
  findUserById(@Param('id') id: number) {
    return this.userProfileService.findUserById(id);
  }

  @Get()
  findAllUsers() {
    return this.userProfileService.findAllUsers();
  }

  @Patch(':id')
  updateUserById(
    @Param('id') id: number,
    @Body() UpdateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfileService.updateUserById(id, UpdateUserProfileDto);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: number) {
    return this.userProfileService.deleteUserById(id);
  }
}
