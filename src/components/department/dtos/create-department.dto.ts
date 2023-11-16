import { IsString, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsNumber()
  totalSeat: number;

  @IsString()
  initial: string;
}
