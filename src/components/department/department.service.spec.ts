import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { departmentModel } from './department.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Department, DepartmentSchema } from './department.schema';
import { Student, StudentSchema } from '../student/student.schema';
import { Faculty, FacultySchema } from '../faculty/faculty.schema';
import { JwtService } from '@nestjs/jwt';
import { departmentOne } from '../../utils/testingStubs/testing.stub';
import { NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dtos/create-department.dto';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let departmentModel: DepartmentService;

  let department: departmentModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/FINAL-NEST-TEST'),
        MongooseModule.forFeature([
          { name: Department.name, schema: DepartmentSchema },
        ]),
        MongooseModule.forFeature([
          { name: Student.name, schema: StudentSchema },
        ]),
        MongooseModule.forFeature([
          { name: Faculty.name, schema: FacultySchema },
        ]),
      ],
      providers: [DepartmentService, JwtService],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
    departmentModel = module.get<DepartmentService>(DepartmentService);
    await departmentModel.clearDepartment();
    department = await departmentModel.create(departmentOne);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create Department test cases', () => {
    it('should create Department', async () => {
      const Department2: CreateDepartmentDto = {
        name: 'Information Technology',
        totalSeat: 100,
        initial: 'IT',
      };

      const result: departmentModel = await service.create(Department2);
      expect(result).not.toBeNull();
    });
  });

  describe('find Department test cases', () => {
    it('should find all Department', async () => {
      const result: departmentModel[] = await service.getDepts();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('update Department test cases', () => {
    it('should update Department', async () => {
      const updatedDepartment = await service.update(
        department._id.toString(),
        {
          totalSeat: 250,
        },
      );
      expect(department.totalSeat !== updatedDepartment.totalSeat);
    });

    it('should not update Department if year is not valid', async () => {
      await expect(
        service.update('2353626754', { totalSeat: 250 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Delete Department test cases', () => {
    it('should delete Department', async () => {
      const deleteDepartment = await service.delete(department._id.toString());
      expect(department.totalSeat !== deleteDepartment.totalSeat);
    });

    it('should not delete Department if id is not valid', async () => {
      await expect(service.delete('2353626754')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
