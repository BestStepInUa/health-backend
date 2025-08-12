import { OmitType } from '@nestjs/mapped-types';

import { CreateUserProfileDto } from './create-user-profile.dto';

export class UserProfileResponseDto extends OmitType(CreateUserProfileDto, [
  'password',
] as const) {}
