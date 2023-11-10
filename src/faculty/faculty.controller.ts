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
  Res,
} from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dtos/create-faculty.dto';
import { Login_SignupFacultyDto } from './dtos/log_sign-faculty.dto';
import { UpdateFacultyDto } from './dtos/update-faculty.dto';
import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthGuard, ExtendedRequest } from '../guards/Auth.guard';
import {
  AdminAuthorizationGuard,
  StaffAuthorizationGuard,
} from '../guards/Authorization.guard';
import * as bcrypt from 'bcrypt';

@Controller('faculty')
export class FacultyController {
  constructor(
    private facultyService: FacultyService,
    private readonly jwtservice: JwtService,
    @InjectModel('Faculty') private readonly Faculty: Model<any>,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard, AdminAuthorizationGuard)
  createFaculty(@Body() body: CreateFacultyDto) {
    return this.facultyService.create(body);
  }

  // @Post('/signup')
  // signupfaculty(@Body() body: Login_SignupfacultyDto) {
  //   return this.authService.signup(body.email, body.password);
  // }

  @Post('/login')
  async login(@Body() body: Login_SignupFacultyDto, @Res() res) {
    try {
      const { email, password } = body;
      const faculty: any = await this.Faculty.findOne({
        email,
      });
      if (faculty) {
        const match = await bcrypt.compare(password, faculty.password);

        if (match) {
          const token = this.jwtservice.sign(
            {
              _id: faculty._id.toString(),
            },
            { secret: process.env.PRIVATE_KEY },
          );

          faculty.authToken = token;
          await faculty.save();

          return res.status(HttpStatus.OK).send(faculty);
        }
      }
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).send(error.message);
    }
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logoutFaculty(@Request() request: ExtendedRequest, @Res() res) {
    try {
      const id = request['id'];
      const faculty = await this.Faculty.findById(id);
      if (!faculty) {
        res.status(404).send('User not found');
      } else {
        res.send('logout Successful');
      }
      faculty.authToken = undefined;
      faculty.save();
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getFaculty(@Request() request: ExtendedRequest) {
    try {
      const id = request['id'];
      const faculty = await this.facultyService.findFaculty(id);
      // console.log(faculty);
      if (!faculty) {
        throw new UnauthorizedException('please Login!');
      }
      return faculty;
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/')
  @UseGuards(AuthGuard, AdminAuthorizationGuard)
  getStudents() {
    return this.facultyService.findFaculties();
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard, StaffAuthorizationGuard)
  async updateFaculty(@Param('id') id: string, @Body() body: UpdateFacultyDto) {
    try {
      return this.facultyService.update(id, body);
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard, AdminAuthorizationGuard)
  deleteFaculty(@Param('id') id: string) {
    try {
      return this.facultyService.delete(id);
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
