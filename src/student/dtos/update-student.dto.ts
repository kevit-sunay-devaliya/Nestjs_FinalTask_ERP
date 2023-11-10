import {
  IsEmail,
  IsString,
  IsOptional,
  IsNumber,
  IsPhoneNumber,
  IsMongoId,
} from 'class-validator';
// import { Types } from 'mongoose';

export class UpdateStudentDto {
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

  @IsNumber()
  @IsOptional()
  semester: number;

  @IsNumber()
  @IsOptional()
  batchYear: number;

  @IsMongoId()
  @IsOptional()
  // departmentId: Types.ObjectId;
  departmentId: string;
}
