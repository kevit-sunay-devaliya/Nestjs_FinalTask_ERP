import { IsEmail, IsString, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateFacultyDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone_number: number;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  role: string;
}
