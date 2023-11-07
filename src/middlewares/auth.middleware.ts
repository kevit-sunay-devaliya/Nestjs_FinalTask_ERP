import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel('Student') private readonly Student: Model<any>,
    private readonly jwtservice: JwtService,
  ) {}

  async use(request: Request, response: Response, next: NextFunction) {
    try {
      const token = request.header('Authorization').replace('Bearer ', '');
      if (!token) {
        throw new UnauthorizedException('Please Login!');
      }

      const decoded = this.jwtservice.verify(token, {
        secret: process.env.PRIVATE_KEY,
      });

      const student = await this.Student.findOne({
        id: decoded._id,
        'tokens.token': token,
      });

      if (!student) {
        throw new UnauthorizedException('Please Login');
      }

      request['token'] = token;
      request['user'] = student;
      next();
    } catch (error) {
      throw new UnauthorizedException('Please Authentication');
    }
  }
}
