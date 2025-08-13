import { PartialType } from '@nestjs/mapped-types';

import { CreateBloodPressureRecordDto } from './create-blood-pressure-record.dto';

export class UpdateBloodPressureRecordDto extends PartialType(
  CreateBloodPressureRecordDto,
) {}
