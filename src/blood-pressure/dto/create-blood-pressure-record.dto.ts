import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateBloodPressureRecordDto {
  @IsInt()
  @Min(50)
  @Max(250)
  systolic: number; // Верхній тиск

  @IsInt()
  @Min(30)
  @Max(200)
  diastolic: number; // Нижній тиск

  @IsInt()
  @Min(30)
  @Max(220)
  pulse: number; // Пульс

  @IsOptional()
  timestamp?: Date;
}
