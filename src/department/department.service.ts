import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Department } from './department.schema';
import { Model } from 'mongoose';
import { CreateDepartmentDto } from './dtos/create-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
  ) {}

  create(body: CreateDepartmentDto) {
    return this.departmentModel.create(body);
  }

  // getDept(id: string) {
  //   return this.departmentModel.findById(id);
  // }

  getDepts() {
    return this.departmentModel.find().lean();
  }

  update(id: string, attrs: Partial<Department>) {
    return this.departmentModel.findByIdAndUpdate(id, attrs, {
      new: true,
      runValidators: true,
    });
  }

  delete(id: string) {
    return this.departmentModel.findByIdAndDelete(id);
  }
}
