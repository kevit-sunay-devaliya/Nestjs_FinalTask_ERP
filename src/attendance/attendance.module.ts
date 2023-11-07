import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/student/student.schema';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from '../student/student.service';
import { FacultyService } from 'src/faculty/faculty.service';
import { Faculty, FacultySchema } from 'src/faculty/faculty.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Faculty.name, schema: FacultySchema }]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, JwtService, StudentService, FacultyService],
})
export class AttendanceModule {}
