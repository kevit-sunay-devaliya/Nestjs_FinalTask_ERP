import { Test, TestingModule } from '@nestjs/testing';
import { FacultyService } from './faculty.service';
import { Faculty, FacultySchema, facultyModel } from './faculty.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { facultyStaff } from '../../utils/testingStubs/testing.stub';
import { CreateFacultyDto } from './dtos/create-faculty.dto';
import { NotFoundException } from '@nestjs/common';

describe('FacultyService', () => {
  let service: FacultyService;
  let facultyModel: FacultyService;

  let faculty: facultyModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/FINAL-NEST-TEST'),
        MongooseModule.forFeature([
          { name: Faculty.name, schema: FacultySchema },
        ]),
      ],
      providers: [FacultyService],
    }).compile();

    service = module.get<FacultyService>(FacultyService);
    facultyModel = module.get<FacultyService>(FacultyService);
    await facultyModel.clearFaculty();

    faculty = await facultyModel.create(facultyStaff);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create staff test case', () => {
    it('should create staff', async () => {
      const faculty2: CreateFacultyDto = {
        name: 'DarshanSir',
        email: 'Darshan@gmail.com',
        password: 'Darshan@123',
        address: 'Rajkot',
        phone_number: 9898989898,
        role: 'Faculty',
        authToken: '',
      };
      const result = await facultyModel.create(faculty2);
      expect(result).not.toBeNull();
    });
  });

  describe('find staff test cases', () => {
    it('find staff by id', async () => {
      const faculty2: facultyModel = await service.findFaculty(
        faculty._id.toString(),
      );
      expect(faculty2).not.toBeNull();
    });

    it('find all staffs', async () => {
      const faculty2: facultyModel[] = await service.findFaculties();
      expect(faculty2.length).toBeGreaterThan(0);
    });

    it('not found error while staff with invalid id', async () => {
      await expect(
        service.findFaculty(faculty._id.toString().concat('sd')),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update staff test cases', () => {
    it('should update staff', async () => {
      const updatedStaff = await service.update(faculty._id.toString(), {
        address: 'Ahmedabad',
      });

      expect(updatedStaff.address !== faculty.address);
    });

    it('should not update staff with invalid id', async () => {
      await expect(
        service.update('852147963258', { address: 'Ahmedabad' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete staff test cases', () => {
    it('should delete staff', async () => {
      const deleted = await service.delete(faculty._id.toString());
      expect(deleted).not.toBeNull();
    });

    it('should not delete staff returns not found exception with invalid id', async () => {
      await expect(service.delete('852369741256')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
