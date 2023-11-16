import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateFacultyDto {
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

  @IsString()
  role: string;

  @IsString()
  authToken: string;
}
