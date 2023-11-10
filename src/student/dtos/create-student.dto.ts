import {
  IsEmail,
  IsMongoId,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
// import { Types } from 'mongoose';

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

  @IsMongoId()
  // departmentId: Types.ObjectId;
  departmentId: string;
}
