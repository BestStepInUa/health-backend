import { Request } from 'express';
import { UserProfileEntity } from 'src/user-profile/entities/user-profile.entity';

// import { LoginAuthDto } from '../dto/login-auth.dto';

export interface RequestWithUser extends Request {
  user: UserProfileEntity;
}
