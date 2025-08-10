import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;
}
