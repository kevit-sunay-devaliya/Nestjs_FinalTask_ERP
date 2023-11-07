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
  Request,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dtos/create-student.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';
import { Login_SignupStudentDto } from './dtos/log_sign-student.dto';
import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { config } from '../config';
import { AuthGuard, ExtendedRequest } from '../guards/Auth.guard';
import { StaffAuthorizationGuard } from 'src/guards/Authorization.guard';

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
    return this.studentService.create(body);
  }

  // @Post('/signup')
  // signupStudent(@Body() body: Login_SignupStudentDto) {
  //   return this.authService.signup(body.email, body.password);
  // }

  @Post('/login')
  async login(@Body() body: Login_SignupStudentDto) {
    const { email, password } = body;
    const student: any = await this.Student.findOne({
      email,
    });
    if (student) {
      const match = password === student.password;

      if (match) {
        const token = this.jwtservice.sign(
          {
            _id: student._id.toString(),
            studentId: student.studentId,
          },
          { secret: config.private_key },
        );

        student.authToken = token;
        await student.save();

        return { student, token };
      }

      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logoutStudent(@Request() request: ExtendedRequest) {
    try {
      const id = request['id'];
      const student = await this.Student.findById(id);
      if (!student) {
        throw new UnauthorizedException('please Login!');
      }
      student.authToken = undefined;
      student.save();
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/')
  @UseGuards(AuthGuard, StaffAuthorizationGuard)
  getStudents() {
    return this.studentService.findStudents();
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getStudent(@Request() request: ExtendedRequest) {
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
}
