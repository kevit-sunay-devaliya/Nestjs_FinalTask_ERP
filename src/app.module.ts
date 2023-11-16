import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './components/student/student.module';
import { FacultyModule } from './components/faculty/faculty.module';
import { DepartmentModule } from './components/department/department.module';
import { AttendanceModule } from './components/attendance/attendance.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
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
