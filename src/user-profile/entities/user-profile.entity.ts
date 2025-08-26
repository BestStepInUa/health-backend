import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: 'Логін не може бути порожнім' })
  @Length(8, 20, {
    message: 'Логін має бути не менше 8 і не більше 20 символів',
  })
  @Column()
  login: string;

  @IsEmail({}, { message: 'Некоректний email' })
  @Column({ unique: true })
  email: string;

  @Exclude()
  @IsNotEmpty({ message: 'Пароль не може бути порожнім' })
  @MinLength(8, { message: 'Пароль має бути не менше 8 символів' })
  @Column({ select: false })
  password: string;

  @Exclude()
  @Column({ type: 'text', nullable: true, select: false })
  currentHashedRefreshToken: string | null;
}
