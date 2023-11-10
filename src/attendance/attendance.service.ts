import { Injectable, NotFoundException } from '@nestjs/common';
// import { AttendanceDto } from './dtos/attendance.dto';
import { Student } from '../student/student.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}
  async fillAttendance(attendanceBody) {
    try {
      attendanceBody.map(async (attendance) => {
        if (attendance.student_id && attendance.date && attendance.present) {
          const student = await this.studentModel.findById(
            attendance.student_id,
          );

          if (
            !student.attendance.some((item) => item.date === attendance.date)
          ) {
            student.attendance.push({
              date: attendance.date,
              present: attendance.present,
              student_id: attendance.student_id,
            });

            await student.save();
          } else {
            throw new Error();
          }
          // console.log(student);
        }
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
