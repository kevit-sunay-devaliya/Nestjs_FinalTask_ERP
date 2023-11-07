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
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dtos/create-faculty.dto';
import { Login_SignupFacultyDto } from './dtos/log_sign-faculty.dto';
import { UpdateFacultyDto } from './dtos/update-faculty.dto';
import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { config } from '../config';
import { AuthGuard, ExtendedRequest } from '../guards/Auth.guard';
import {
  AdminAuthorizationGuard,
  StaffAuthorizationGuard,
} from 'src/guards/Authorization.guard';

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
  async login(@Body() body: Login_SignupFacultyDto) {
    // console.log('heyt');
    const { email, password } = body;
    const faculty: any = await this.Faculty.findOne({
      email,
    });
    if (faculty) {
      const match = password === faculty.password;

      if (match) {
        const token = this.jwtservice.sign(
          {
            _id: faculty._id.toString(),
          },
          { secret: config.private_key },
        );

        faculty.authToken = token;
        await faculty.save();

        return { faculty, token };
      }

      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('Faculty not found', HttpStatus.NOT_FOUND);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logoutFaculty(@Request() request: ExtendedRequest) {
    try {
      const id = request['id'];
      const faculty = await this.Faculty.findById(id);
      if (!faculty) {
        throw new UnauthorizedException('please Login!');
      }
      faculty.authToken = undefined;
      faculty.save();
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
