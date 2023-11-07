import { IsEmail, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone_number: number;

  @IsString()
  password: string;

  @IsString()
  address: string;

  @IsNumber()
  semester: number;

  @IsNumber()
  batchYear: number;
}
