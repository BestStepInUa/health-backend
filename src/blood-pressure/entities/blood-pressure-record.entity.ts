import { UserProfileEntity } from 'src/user-profile/entities/user-profile.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['user', 'timestamp'])
export class BloodPressureRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint', unsigned: true })
  systolic: number; // Верхній тиск

  @Column({ type: 'smallint', unsigned: true })
  diastolic: number; // Нижній тиск

  @Column({ type: 'smallint', unsigned: true })
  pulse: number; // Пульс

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => UserProfileEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserProfileEntity;
}
