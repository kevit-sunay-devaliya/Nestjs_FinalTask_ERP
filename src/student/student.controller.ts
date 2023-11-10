import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  // Request,
  Req,
  Res,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dtos/create-student.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';
import { Login_SignupStudentDto } from './dtos/log_sign-student.dto';
import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthGuard } from '../guards/Auth.guard';
import { StaffAuthorizationGuard } from '../guards/Authorization.guard';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
// import { Request } from 'express';
@Controller('student')
export class StudentController {
  constructor(
    private studentService: StudentService,
    private readonly jwtservice: JwtService,

    @InjectModel('Student') private readonly Student: Model<any>,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard, StaffAuthorizationGuard)
  createStudent(@Body() body: CreateStudentDto) {
    // this.loggerService.logInfo('Student Created!');
    return this.studentService.create(body);
  }

  // @Post('/signup')
  // signupStudent(@Body() body: Login_SignupStudentDto) {
  //   return this.authService.signup(body.email, body.password);
  // }

  @Post('/login')
  async login(@Body() body: Login_SignupStudentDto, @Res() res) {
    try {
      const { email, password } = body;
      const student: any = await this.Student.findOne({
        email,
      });
      if (student) {
        const match = await bcrypt.compare(password, student.password);
        if (match) {
          const token = this.jwtservice.sign(
            {
              _id: student._id.toString(),
              studentId: student.studentId,
            },
            { secret: process.env.PRIVATE_KEY },
          );

          student.authToken = token;
          await student.save();

          return res.status(HttpStatus.OK).send(student);
        }
      }
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).send(error.message);
    }
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logoutStudent(@Req() request: Request, @Res() res) {
    try {
      const id = request['id'];
      const student = await this.Student.findById(id);
      if (!student) {
        res.status(404).send('User not found');
      } else {
        res.send('logout Successful');
      }
      student.authToken = undefined;
      student.save();
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  @Get('/')
  @UseGuards(AuthGuard, StaffAuthorizationGuard)
  getStudents() {
    return this.studentService.findStudents();
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getStudent(@Req() request: Request) {
    try {
      const id = request['id'];
      const student = await this.studentService.findStudent(id);
      console.log(student);
      if (!student) {
        throw new UnauthorizedException('please Login!');
      }
      return student;
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard)
  async updateStudent(@Param('id') id: string, @Body() body: UpdateStudentDto) {
    try {
      return this.studentService.update(id, body);
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard, StaffAuthorizationGuard)
  deleteStudent(@Param('id') id: string) {
    try {
      return this.studentService.delete(id);
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/getBatchDepartmentWiseStudents')
  @UseGuards(AuthGuard, StaffAuthorizationGuard)
  getBatchDepartmentWiseData() {
    try {
      return this.studentService.getBatchDepartmentWiseData();
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/getAbsentStudents')
  @UseGuards(AuthGuard, StaffAuthorizationGuard)
  getAbsentStudentBatchYearSemesterDateWise(@Req() request: Request) {
    try {
      return this.studentService.getAbsentStudentBatchYearSemesterDateWise(
        request.body,
      );
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/getMoreThen75PercentAttendanceStudent')
  @UseGuards(AuthGuard, StaffAuthorizationGuard)
  getMoreThen75PercentStudent(@Req() request: Request) {
    try {
      return this.studentService.getMoreThen75PercentStudent(request.body);
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/getVacancySeat')
  @UseGuards(AuthGuard, StaffAuthorizationGuard)
  getVacancySeat(@Req() request: Request) {
    try {
      return this.studentService.getVacancySeat(request.body);
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
