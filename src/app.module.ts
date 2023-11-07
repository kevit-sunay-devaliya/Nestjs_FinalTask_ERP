import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { FacultyModule } from './faculty/faculty.module';
import { DepartmentModule } from './department/department.module';
import { AttendanceModule } from './attendance/attendance.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { AuthGuard } from './guards/Auth.guard';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/FINAL-NEST'),
    StudentModule,
    FacultyModule,
    DepartmentModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdasfafd'],
        }),
      )
      .forRoutes('*');
  }
}