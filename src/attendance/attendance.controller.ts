import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceDto } from './dtos/attendance.dto';
import { AuthGuard } from 'src/guards/Auth.guard';
import { StaffAuthorizationGuard } from 'src/guards/Authorization.guard';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('/add')
  @UseGuards(AuthGuard, StaffAuthorizationGuard)
  fillAttendance(@Body() body: AttendanceDto) {
    return this.attendanceService.fillAttendance(body);
  }
}
