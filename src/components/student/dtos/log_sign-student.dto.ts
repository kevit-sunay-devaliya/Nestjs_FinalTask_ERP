import { IsEmail, IsString } from 'class-validator';

export class Login_SignupStudentDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
