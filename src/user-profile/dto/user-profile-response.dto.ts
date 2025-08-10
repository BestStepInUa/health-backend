import { CreateUserProfileDto } from './create-user-profile.dto';

export type UserProfileResponseDto = Omit<CreateUserProfileDto, 'password'>;
