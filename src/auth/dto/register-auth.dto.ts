import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty({ message: 'Логін не може бути порожнім' })
  @Length(8, 20, {
    message: 'Логін має бути не менше 8 і не більше 20 символів',
  })
  login: string;

  @IsEmail({}, { message: 'Некоректний email' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не може бути порожнім' })
  @MinLength(8, { message: 'Пароль має бути не менше 8 символів' })
  password: string;
}
