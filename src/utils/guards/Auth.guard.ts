import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { StudentService } from '../../components/student/student.service';
import { FacultyService } from '../../components/faculty/faculty.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private studentsService: StudentService,
    private facultyService: FacultyService,
  ) {}

  /**
   * Checks if a request is authorized based on the provided JWT token.
   * @param {ExecutionContext} context - The execution context.
   * @returns {Promise<boolean>} - A boolean indicating whether the request is authorized.
   * @throws {UnauthorizedException} - Throws an exception if the request is unauthorized.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Please Login!');
    }
    // try {
    //   const privateKey = fs.readFileSync(
    //     join(__dirname, '../../../keys/Private.key'),
    //   );
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.PRIVATE_KEY,
      });

      const user =
        (await this.studentsService.findStudent(payload._id)) === null
          ? await this.facultyService.findFaculty(payload._id)
          : await this.studentsService.findStudent(payload._id);
      // const student = await this.studentsService.findStudent(payload._id);
      if (!user.authToken) {
        throw new UnauthorizedException('Please Login!');
      }
      request['user'] = user;
      // request.role = payload.role;
      request.id = payload._id;
      // return student.authToken;
      // request.user = student;
    } catch (error) {
      throw new UnauthorizedException('Please Login!');
    }
    return true;
  }

  /**
   * Extracts the JWT token from the request's authorization header.
   * @param {Request} request - The HTTP request object.
   * @returns {string | undefined} - The extracted JWT token or undefined if not found.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export interface ExtendedRequest extends Request {
  id: string;
  email: string;
}
