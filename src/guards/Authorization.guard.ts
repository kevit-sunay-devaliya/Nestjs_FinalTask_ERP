import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FacultyService } from '../faculty/faculty.service';

@Injectable()
export class AdminAuthorizationGuard implements CanActivate {
  // constructor(private facultyService: FacultyService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    // const id = request.id;
    if (!request['user']) {
      throw new NotFoundException();
    }
    // const faculty = await this.facultyService.findFaculty(id);
    if (request['user'].role === 'Admin') {
      return true;
    }
    throw new UnauthorizedException(
      'Only Admin are permitted to access this route',
    );
  }
}

@Injectable()
export class StaffAuthorizationGuard implements CanActivate {
  constructor(private facultyService: FacultyService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    // const id = request.id;
    if (!request['user']) {
      throw new NotFoundException();
    }
    // const faculty = await this.facultyService.findFaculty(id);
    if (
      request['user'].role === 'Admin' ||
      request['user'].role === 'Faculty'
    ) {
      return true;
    }
    throw new UnauthorizedException(
      'Only Faculty are permitted to access this route',
    );
  }
}
