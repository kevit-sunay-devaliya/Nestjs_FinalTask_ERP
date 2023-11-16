import { IsEmail, IsString } from 'class-validator';

export class Login_SignupFacultyDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
