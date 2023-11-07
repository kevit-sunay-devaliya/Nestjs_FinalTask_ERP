import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './student.schema';
import { CreateStudentDto } from './dtos/create-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  create(body: CreateStudentDto) {
    return this.studentModel.create(body);
    // return this.studentModel.save(student);
  }
  findStudentByEmailId(emailId) {
    return this.studentModel.findOne({ emailId });
  }

  findStudents() {
    return this.studentModel.find().lean();
  }

  findStudent(id: string) {
    return this.studentModel.findById(id);
  }

  // find(email: string) {
  //   return this.studentModel.find({ email });
  // }

  update(id: string, attrs: Partial<Student>) {
    return this.studentModel.findByIdAndUpdate(id, attrs, {
      new: true,
      runValidators: true,
    });
  }

  delete(id: string) {
    return this.studentModel.findByIdAndDelete(id);
  }
}
