import { OmitType } from '@nestjs/mapped-types';

import { CreateUserProfileDto } from './create-user-profile.dto';

export class UserProfileResponseWithAuthDto extends OmitType(
  CreateUserProfileDto,
  ['password'] as const,
) {
  password: string;
}
