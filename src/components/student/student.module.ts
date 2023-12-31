import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentSchema } from './student.schema';
import { Student } from './student.schema';
import { MongooseModule } from '@nestjs/mongoose';
// import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { FacultyService } from '../faculty/faculty.service';
import { Faculty, FacultySchema } from '../faculty/faculty.schema';
import { Logger } from 'winston';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Faculty.name, schema: FacultySchema }]),
  ],
  controllers: [StudentController],
  providers: [StudentService, JwtService, FacultyService, Logger],
  exports: [StudentService],
})
export class StudentModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).forRoutes('/logout');
  // }
}
