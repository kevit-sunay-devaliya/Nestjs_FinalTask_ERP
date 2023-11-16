import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';

import { studentModel, Student, StudentSchema } from './student.schema';
import { studentLogin } from '../../utils/testingStubs/testing.stub';
import { CreateStudentDto } from './dtos/create-student.dto';
import { Department, DepartmentSchema } from '../department/department.schema';
import { DepartmentService } from '../department/department.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultySchema, Faculty } from '../faculty/faculty.schema';
import { NotFoundException } from '@nestjs/common';

describe('StudentService', () => {
  let service: StudentService;
  let studentModel: StudentService;
  let departmentModel: DepartmentService;

  let student: studentModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/FINAL-NEST-TEST'),

        MongooseModule.forFeature([
          { name: Student.name, schema: StudentSchema },
        ]),
        MongooseModule.forFeature([
          { name: Department.name, schema: DepartmentSchema },
        ]),
        MongooseModule.forFeature([
          { name: Faculty.name, schema: FacultySchema },
        ]),
      ],
      providers: [StudentService, DepartmentService],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentModel = module.get<StudentService>(StudentService);
    departmentModel = module.get<DepartmentService>(DepartmentService);

    await studentModel.clearStudent();
    await departmentModel.clearDepartment();
    student = await studentModel.create(studentLogin);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create student test case', () => {
    it('should create student', async () => {
      const student2: CreateStudentDto = {
        name: 'Sunay for login',
        email: 'Sunaylogin@gmail.com',
        password: 'Sunaylogin@2023',
        address: 'Rajkot',
        departmentId: '65547a9c5aa9374155119cb6',
        phone_number: 9898424242,
        authToken: '',
        semester: 1,
        batchYear: 2023,
        attendance: [],
      };

      const result: studentModel = await service.create(student2);
      expect(result).not.toBeNull();
    });
  });

  describe('find student test cases', () => {
    it('should find student student by id', async () => {
      const result = await service.findStudent(student._id.toString());
      expect(result).not.toBeNull();
    });

    it('should not find student student with invalid id', async () => {
      await expect(service.findStudent('852369741256')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('find all students', async () => {
      const students: studentModel[] = await service.findStudents();
      expect(students.length).toBeGreaterThan(0);
    });
  });

  describe('update student test cases', () => {
    it('should update student', async () => {
      const updatedStudent: studentModel = await service.update(
        student._id.toString(),
        { semester: 8 },
      );
      expect(updatedStudent.semester !== student.semester);
    });

    it('should not update student with invalid id of the student', async () => {
      await expect(
        service.update('741258963214', { semester: 8 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete student test cases', () => {
    it('should delete student', async () => {
      const deletedStudent: studentModel = await service.delete(
        student._id.toString(),
      );
      expect(deletedStudent).not.toBeNull();

      await expect(service.findStudent(student._id.toString())).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not delete student with invalid id of the student', async () => {
      await expect(service.delete('741258963215')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
