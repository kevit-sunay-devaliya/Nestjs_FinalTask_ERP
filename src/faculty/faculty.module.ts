import { Module } from '@nestjs/common';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultySchema } from './faculty.schema';
import { Faculty } from './faculty.schema';
import { Student, StudentSchema } from '../student/student.schema';
import { StudentService } from '../student/student.service';
// import { AuthGuard } from 'src/guards/Auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Faculty.name, schema: FacultySchema }]),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  controllers: [FacultyController],
  providers: [FacultyService, JwtService, StudentService],
  exports: [FacultyService],
})
export class FacultyModule {}
