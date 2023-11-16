import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentSchema, Student, studentModel } from './student.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateStudentDto } from './dtos/create-student.dto';
import { studentLogin } from '../../utils/testingStubs/testing.stub';
import { Department, DepartmentSchema } from '../department/department.schema';
import { DepartmentService } from '../department/department.service';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FacultyService } from '../faculty/faculty.service';
import { FacultySchema, Faculty } from '../faculty/faculty.schema';

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;
  let departmentModel: DepartmentService;
  let studentModel: StudentService;

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
      providers: [
        StudentService,
        DepartmentService,
        JwtService,
        FacultyService,
      ],
      controllers: [StudentController],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
    studentModel = module.get<StudentService>(StudentService);
    departmentModel = module.get<DepartmentService>(DepartmentService);

    await studentModel.clearStudent();
    await departmentModel.clearDepartment();
    student = await studentModel.create(studentLogin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const result = await controller.createStudent(student2);
      expect(result).not.toBeNull();
    });
  });

  describe('find student test cases', () => {
    it('should find student student by id', async () => {
      const result = await controller.findStudent(student._id.toString());
      expect(result).not.toBeNull();
    });

    it('should not find student student with invalid id', async () => {
      await expect(controller.findStudent('852369741256')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('find all students', async () => {
      const students: studentModel[] = await controller.getStudents();
      expect(students.length).toBeGreaterThan(0);
    });
  });

  describe('update student test cases', () => {
    it('should update student', async () => {
      const updatedStudent: studentModel = await controller.updateStudent(
        student._id.toString(),
        { semester: 8 },
      );
      expect(updatedStudent.semester !== student.semester);
    });

    it('should not update student with invalid id of the student', async () => {
      await expect(
        controller.updateStudent('741258963214', { semester: 8 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete student test cases', () => {
    it('should delete student', async () => {
      const deletedStudent: studentModel = await service.delete(
        student._id.toString(),
      );
      expect(deletedStudent).not.toBeNull();

      await expect(
        controller.findStudent(student._id.toString()),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not delete student with invalid id of the student', async () => {
      await expect(controller.deleteStudent('741258963215')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
