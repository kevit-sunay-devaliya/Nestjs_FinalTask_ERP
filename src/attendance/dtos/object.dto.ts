import { IsString, IsBoolean } from 'class-validator';

export class ObjectDTO {
  @IsString()
  student_id: string;

  @IsString()
  date: string;

  @IsBoolean()
  present: string;
}
