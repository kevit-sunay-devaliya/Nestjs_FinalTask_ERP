import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentSchema, Department } from './department.schema';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from '../student/student.service';
import { Student, StudentSchema } from '../student/student.schema';
import { FacultyService } from '../faculty/faculty.service';
import { Faculty, FacultySchema } from '../faculty/faculty.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
    ]),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Faculty.name, schema: FacultySchema }]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService, JwtService, StudentService, FacultyService],
  exports: [],
})
export class DepartmentModule {}
