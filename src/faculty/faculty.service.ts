import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Faculty } from './faculty.schema';
import { CreateFacultyDto } from './dtos/create-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(
    @InjectModel(Faculty.name) private facultyModel: Model<Faculty>,
  ) {}

  create(body: CreateFacultyDto) {
    return this.facultyModel.create(body);
    // return this.studentModel.save(student);
  }
  findFacultyByEmailId(emailId) {
    return this.facultyModel.findOne({ emailId });
  }

  findFaculty(id: string) {
    return this.facultyModel.findById(id);
  }

  findFaculties() {
    return this.facultyModel.find().lean();
  }

  // find(email: string) {
  //   return this.studentModel.find({ email });
  // }

  update(id: string, attrs: Partial<Faculty>) {
    return this.facultyModel.findByIdAndUpdate(id, attrs, {
      new: true,
      runValidators: true,
    });
  }

  delete(id: string) {
    return this.facultyModel.findByIdAndDelete(id);
  }
}
