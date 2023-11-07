import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateDepartmentDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  totalSeat: number;

  @IsString()
  @IsOptional()
  initial: string;
}
