import { Expose } from 'class-transformer';

import { CreateBloodPressureRecordDto } from './create-blood-pressure-record.dto';

export class BloodPressureRecordResponseDto extends CreateBloodPressureRecordDto {
  @Expose()
  id: number; // унікальний ідентифікатор запису

  @Expose()
  declare timestamp: Date; // дата і час вимірювання (обов’язкове)
}
