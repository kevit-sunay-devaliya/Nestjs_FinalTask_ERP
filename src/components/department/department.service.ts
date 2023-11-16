import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.departmentModel.find();
  }

  async update(id: string, attrs: Partial<Department>) {
    try {
      const department = await this.departmentModel.findByIdAndUpdate(
        id,
        attrs,
        {
          new: true,
          runValidators: true,
        },
      );
      if (!department) {
        throw new NotFoundException('NOT FOUND!');
      }
      return department;
    } catch (error) {
      throw new NotFoundException('NOT FOUND!');
    }
  }

  async delete(id: string) {
    try {
      const department = await this.departmentModel.findByIdAndDelete(id);
      if (!department) {
        throw new NotFoundException('NOT FOUND!');
      }
      return department;
    } catch (error) {
      throw new NotFoundException('NOT FOUND!');
    }
  }

  clearDepartment() {
    return this.departmentModel.deleteMany();
  }
}
