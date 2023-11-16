import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findFaculty(id: string) {
    try {
      const faculty = await this.facultyModel.findById(id);
      if (!faculty) {
        throw new NotFoundException('NOT FOUND!');
      }
      return faculty;
    } catch (error) {
      throw new NotFoundException('NOT FOUND!');
    }
  }

  findFaculties() {
    return this.facultyModel.find();
  }

  // find(email: string) {
  //   return this.studentModel.find({ email });
  // }

  async update(id: string, attrs: Partial<Faculty>) {
    try {
      const faculty = await this.facultyModel.findByIdAndUpdate(id, attrs, {
        new: true,
        runValidators: true,
      });
      if (!faculty) {
        throw new NotFoundException('NOT FOUND!');
      }
      return faculty;
    } catch (error) {
      throw new NotFoundException('NOT FOUND!');
    }
  }
  async delete(id: string) {
    try {
      const faculty = await this.facultyModel.findByIdAndDelete(id);
      if (!faculty) {
        throw new NotFoundException('NOT FOUND!');
      }
      return faculty;
    } catch (error) {
      throw new NotFoundException('NOT FOUND!');
    }
  }

  clearFaculty() {
    return this.facultyModel.deleteMany();
  }
}
