import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentSchema, Department } from './department.schema';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import { Student, StudentSchema } from 'src/student/student.schema';
import { FacultyService } from 'src/faculty/faculty.service';
import { Faculty, FacultySchema } from 'src/faculty/faculty.schema';
// import { AuthGuard } from 'src/guards/Auth.guard';

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
