import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './department.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DepartmentSchema,
  Department,
  departmentModel,
} from './department.schema';
import { DepartmentService } from './department.service';
import { JwtService } from '@nestjs/jwt';
import { departmentOne } from '../../utils/testingStubs/testing.stub';
import { NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { StudentService } from '../student/student.service';
import { Student, StudentSchema } from '../student/student.schema';
import { FacultyService } from '../faculty/faculty.service';
import { Faculty, FacultySchema } from '../faculty/faculty.schema';
describe('DepartmentController', () => {
  let controller: DepartmentController;
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
      providers: [
        DepartmentService,
        JwtService,
        StudentService,
        FacultyService,
      ],
      controllers: [DepartmentController],
    }).compile();

    controller = module.get<DepartmentController>(DepartmentController);
    departmentModel = module.get<DepartmentService>(DepartmentService);

    await departmentModel.clearDepartment();
    department = await departmentModel.create(departmentOne);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create batch test cases', () => {
    it('should create batch', async () => {
      const batch2: CreateDepartmentDto = {
        name: 'Information Technology',
        totalSeat: 100,
        initial: 'IT',
      };

      const result: departmentModel = await controller.createDepartment(batch2);
      expect(result).not.toBeNull();
    });
  });

  describe('find batch test cases', () => {
    it('should find all batch', async () => {
      const result: departmentModel[] = await controller.getDepartments();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('update batch test cases', () => {
    it('should update batch', async () => {
      const updatedBatch = await controller.updateDepartment(
        department._id.toString(),
        {
          totalSeat: 200,
        },
      );
      expect(department.totalSeat !== updatedBatch.totalSeat);
    });

    it('should not update batch if year is not valid', async () => {
      await expect(
        controller.updateDepartment('12432344254365', { totalSeat: 200 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
