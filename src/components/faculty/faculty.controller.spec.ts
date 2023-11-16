import { Test, TestingModule } from '@nestjs/testing';
import { FacultyController } from './faculty.controller';
import { facultyModel } from '../../../dist/components/faculty/faculty.schema';
import { FacultyService } from './faculty.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Faculty, FacultySchema } from './faculty.schema';
import { JwtService } from '@nestjs/jwt';
import { facultyStaff } from '../../utils/testingStubs/testing.stub';
import { StudentService } from '../student/student.service';
import { Student, StudentSchema } from '../student/student.schema';
import { NotFoundException } from '@nestjs/common';

describe('FacultyController', () => {
  let controller: FacultyController;
  let facultyModel: FacultyService;

  let faculty: facultyModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/FINAL-NEST-TEST'),
        MongooseModule.forFeature([
          { name: Faculty.name, schema: FacultySchema },
        ]),
        MongooseModule.forFeature([
          { name: Student.name, schema: StudentSchema },
        ]),
      ],
      providers: [FacultyService, JwtService, StudentService],
      controllers: [FacultyController],
    }).compile();

    controller = module.get<FacultyController>(FacultyController);

    // service = module.get<FacultyService>(FacultyService);
    facultyModel = module.get<FacultyService>(FacultyService);

    await facultyModel.clearFaculty();
    faculty = await facultyModel.create(facultyStaff);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create staff test cases', () => {
    it('should create staff', async () => {
      const faculty2 = {
        name: 'DarshanSir',
        email: 'Darshan@gmail.com',
        password: 'Darshan@123',
        address: 'Rajkot',
        phone_number: 9898989898,
        role: 'Faculty',
        authToken: '',
      };
      const result = await controller.createFaculty(faculty2);
      expect(result).not.toBeNull();
    });
  });

  describe('find staff test cases', () => {
    it('find staff by id', async () => {
      const faculty2: facultyModel = await controller.findFaculty(
        faculty._id.toString(),
      );
      expect(faculty2).not.toBeNull();
    });

    it('find all staffs', async () => {
      const staff2: facultyModel[] = await controller.findFaculties();
      expect(staff2.length).toBeGreaterThan(0);
    });

    it('not found error while staff with invalid id', async () => {
      await expect(
        controller.findFaculty(faculty._id.toString().concat('sd')),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('sign in test case', () => {
    it('should signin faculty', async () => {
      const faculty2 = await controller.login({
        email: faculty.email,
        password: 'Darshan@123',
      });
      expect(faculty2.authToken).not.toBeNull();
    });
  });

  describe('update staff test cases', () => {
    it('should update staff', async () => {
      const updatedStaff = await controller.updateFaculty(
        faculty._id.toString(),
        { address: 'Ahmedabad' },
      );

      expect(updatedStaff.address !== faculty.address);
    });

    it('should not update staff with invalid id', async () => {
      await expect(
        controller.updateFaculty('852147963258', { address: 'Ahmedabad' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete staff test cases', () => {
    it('should delete staff', async () => {
      const deleted = await controller.deleteFaculty(faculty._id.toString());
      expect(deleted).not.toBeNull();
    });

    it('should not delete staff returns not found exception with invalid id', async () => {
      await expect(controller.deleteFaculty('852369741256')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
