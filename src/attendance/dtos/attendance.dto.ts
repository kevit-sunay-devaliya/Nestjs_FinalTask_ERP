// array.dto.ts
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectDTO } from './object.dto';

export class AttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObjectDTO)
  arrayOfObjects: ObjectDTO[];
}
