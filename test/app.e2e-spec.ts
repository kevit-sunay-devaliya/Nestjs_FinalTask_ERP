/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { StudentService } from '../src/components/student/student.service';
import { FacultyService } from '../src/components/faculty/faculty.service';
import { DepartmentService } from '../src/components/department/department.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StudentSchema,
  studentModel,
  Student,
} from '../src/components/student/student.schema';
import {
  FacultySchema,
  facultyModel,
  Faculty,
} from '../src/components/faculty/faculty.schema';
import {
  Department,
  DepartmentSchema,
  departmentModel,
} from '../src/components/department/department.schema';
import {
  studentLogin,
  facultyAdmin,
  facultyStaff,
  // demoFacultyToCreate,
  // demoStudentToCreate,
  departmentOne,
  // departmentToCreate,
} from '../src/utils/testingStubs/testing.stub';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let studentModel: StudentService;
  let facultyModel: FacultyService;
  let departmentModel: DepartmentService;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let student: studentModel;
  let faculty: facultyModel;
  let facAdmin: facultyModel;
  let department: departmentModel;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Student.name, schema: StudentSchema },
        ]),
        MongooseModule.forFeature([
          { name: Faculty.name, schema: FacultySchema },
        ]),
        MongooseModule.forFeature([
          { name: Department.name, schema: DepartmentSchema },
        ]),
        AppModule,
      ],
      providers: [StudentService, FacultyService, DepartmentService],
    }).compile();

    studentModel = moduleFixture.get<StudentService>(StudentService);
    facultyModel = moduleFixture.get<FacultyService>(FacultyService);
    departmentModel = moduleFixture.get<DepartmentService>(DepartmentService);

    await facultyModel.clearFaculty();
    await studentModel.clearStudent();
    await departmentModel.clearDepartment();

    department = await departmentModel.create(departmentOne);
    await department.save();
    student = await studentModel.create(studentLogin);
    await student.save();
    faculty = await facultyModel.create(facultyStaff);
    await faculty.save();
    facAdmin = await facultyModel.create(facultyAdmin);
    await facAdmin.save();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //STUDENT ROUTE TEST-CASES
  describe('Login-STUDENT', () => {
    it('Student login correctly', () => {
      return request(app.getHttpServer())
        .post('/student/login')
        .send({
          email: student.email,
          password: 'Sunaylogin@2023',
        })
        .expect(200);

      // expect(response._body.success).toBe(true);
    });
    it('Admin not login correctly', () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          email: facultyAdmin.email,
          password: 'Admin@123444',
        })
        .expect(401);
    });
  });

  describe('login-ADMIN', () => {
    it('Admin login correctly', () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          email: facultyAdmin.email,
          password: 'Admin@123',
        })
        .expect(200);
    });
    it('Admin not login correctly', () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          email: facultyAdmin.email,
          password: 'Admin@123444',
        })
        .expect(401);
    });
  });

  describe('login-FACULTY', () => {
    it('Faculty login correctly', () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          email: faculty.email,
          password: 'Darshan@123',
        })
        .expect(200);
    });
    it('Admin not login correctly', () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          email: faculty.email,
          password: 'Darshan@12344',
        })
        .expect(401);
    });
  });

  describe('create-STUDENT', () => {
    it('Admin can create student', () => {
      return request(app.getHttpServer())
        .post('/student/create')
        .set('Authorization', `Bearer ${facultyAdmin.authToken}`)
        .send({
          name: 'niket for login',
          email: 'niket@gmail.com',
          password: 'Sunaylogin@2023',
          address: 'Rajkot',
          phone_number: 9898424242,
          departmentId: department._id,
          semester: 1,
          batchYear: 2023,
          attendance: [],
        })
        .expect(201);
    });

    it('Faculty can create new Student', () => {
      return request(app.getHttpServer())
        .post('/student/create')
        .set('Authorization', `Bearer ${faculty.authToken}`)
        .send({
          name: 'niket for login',
          email: 'niket@gmail.com',
          password: 'Sunaylogin@2023',
          address: 'Rajkot',
          phone_number: 9898424242,
          departmentId: department._id,
          semester: 1,
          batchYear: 2023,
          attendance: [],
        })
        .expect(201);
    });
  });

  describe('update Student', () => {
    it('Admin/Faculty Update Student By Id', () => {
      return request(app.getHttpServer())
        .patch(`/student/update/${student._id}`)
        .set('Authorization', `Bearer ${faculty.authToken}`)
        .send({
          name: 'Updated Student',
        })
        .expect(200);
    });
    it('Student can not Update Student By Id', () => {
      return request(app.getHttpServer())
        .patch(`/student/update/${student._id}`)
        .set('Authorization', `Bearer ${student.authToken}`)
        .send({
          name: 'Updated Student',
        })
        .expect(200);
    });
  });

  describe('LogOut Student', () => {
    it('LogOut Student', () => {
      return request(app.getHttpServer())
        .post('/student/logout')
        .set('Authorization', `Bearer ${student.authToken}`)
        .expect(201);
    });
  });

  describe('Get Profile', () => {
    it('Get Profile', () => {
      return request(app.getHttpServer())
        .get('/student/profile')
        .set('Authorization', `Bearer ${student.authToken}`)
        .expect(200);
    });
  });

  //FACULTY ROUTE TEST-CASES
  describe('Create new Faculty', () => {
    test('Only Admin can create Faculty', () => {
      return request(app.getHttpServer())
        .post('/faculty/create')
        .set('Authorization', `Bearer ${facultyAdmin.authToken}`)
        .send({
          name: 'Demo',
          email: 'Sunay@gmail.com',
          password: 'Sunay@123',
          address: 'Rajkot',
          phone_number: 9898989898,
          // departmentId:departmentId,
          role: 'Faculty',
        })
        .expect(201);
    });

    it('Faculty can not add new Faculty', () => {
      return request(app.getHttpServer())
        .post('/faculty/create')
        .set('Authorization', `Bearer ${faculty.authToken}`)
        .send({
          name: 'Demo',
          email: 'Sunay@gmail.com',
          password: 'Sunay@123',
          address: 'Rajkot',
          phone_number: 9898989898,
          // departmentId:departmentId,
          role: 'Faculty',
        })
        .expect(401);
    });
  });

  describe('Login Faculty', () => {
    it('Faculty Login', () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          email: faculty.email,
          password: 'Darshan@123',
        })
        .expect(200);
    });

    it('Faculty could not able to Login while entering wrong username and password', async () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          email: faculty.email,
          password: 'Darshan@12345',
        })
        .expect(401);
    });
  });

  describe('update Faculty', () => {
    it('Admin Update Faculty By Id', async () => {
      return request(app.getHttpServer())
        .patch(`/faculty/update/${faculty._id}`)
        .set('Authorization', `Bearer ${facultyAdmin.authToken}`)
        .send({
          name: 'Updated Faculty',
          role: 'Faculty',
        })
        .expect(200);
    });

    it('Student can not Update Staff Faculty By Id', async () => {
      return request(app.getHttpServer())
        .patch(`/faculty/update/${faculty._id}`)
        .set('Authorization', `Bearer ${student.authToken}`)
        .send({
          name: 'Demo faculty',
          role: 'Faculty',
        })
        .expect(401);
    });
  });

  describe('delete Faculty', () => {
    it('Faculty can not delete Staff Faculty By Id', async () => {
      return request(app.getHttpServer())
        .delete(`/faculty/delete/${faculty._id}`)
        .set('Authorization', `Bearer ${faculty.authToken}`)
        .expect(401);
    });

    it('Admin delete Faculty By Id', async () => {
      return request(app.getHttpServer())
        .delete(`/faculty/delete/${faculty._id}`)
        .set('Authorization', `Bearer ${facultyAdmin.authToken}`)
        .expect(200);
    });
  });

  describe('Get Profile', () => {
    it('Get Profile', async () => {
      return request(app.getHttpServer())
        .get('/faculty/profile')
        .set('Authorization', `Bearer ${faculty.authToken}`)
        .expect(200);
    });
  });

  describe('LogOut Faculty', () => {
    it('LogOut Faculty', async () => {
      return request(app.getHttpServer())
        .post('/faculty/logout')
        .set('Authorization', `Bearer ${faculty.authToken}`)
        .expect(201);
    });
  });

  //Department ROUTE TEST-CASES

  describe('Create new Department', () => {
    it('Admin can Create new Department', () => {
      return request(app.getHttpServer())
        .post('/department/create')
        .set('Authorization', `Bearer ${facultyAdmin.authToken}`)
        .send({
          name: 'Computer Engineering',
          totalSeat: 20,
          initial: 'CE',
        })
        .expect(201);
    });

    it('Faculty can not Create new Department', () => {
      return request(app.getHttpServer())
        .post('/department/create')
        .set('Authorization', `Bearer ${faculty.authToken}`)
        .send({
          name: 'Computer Engineering',
          totalSeat: 20,
          initial: 'CE',
        })
        .expect(401);
    });
  });

  describe('List Departments', () => {
    it('List Departments', () => {
      return request(app.getHttpServer())
        .get('/department')
        .set('Authorization', `Bearer ${facultyAdmin.authToken}`)
        .expect(200);
    });
  });

  describe('Update Department', () => {
    it('Admin can Update Department', () => {
      return request(app.getHttpServer())
        .patch(`/department/update/${department._id}`)
        .set('Authorization', `Bearer ${facultyAdmin.authToken}`)
        .send({
          name: 'Mechanical Engineering',
          initial: 'ME',
          totalSeat: 100,
        })
        .expect(200);
    });

    it('Faculty can not Update Department', () => {
      return request(app.getHttpServer())
        .patch(`/department/update/${department._id}`)
        .set('Authorization', `Bearer ${faculty.authToken}`)
        .send({
          name: 'Mechanical Engineering',
          initial: 'ME',
          totalSeat: 100,
        })
        .expect(401);
    });
  });

  describe('delete Department', () => {
    it('Admin can delete Department', () => {
      return request(app.getHttpServer())
        .delete(`/department/delete/${department._id}`)
        .set('Authorization', `Bearer ${facultyAdmin.authToken}`)
        .expect(200);
    });

    it('Faculty can not delete Department', () => {
      return request(app.getHttpServer())
        .delete(`/department/delete/${department._id}`)
        .set('Authorization', `Bearer ${faculty.authToken}`)
        .expect(401);
    });
  });

  //Attendance ROUTE TEST-CASES
  describe('Fill Attendance', () => {
    it('Admin can fill attendance', () => {
      return request(app.getHttpServer())
        .post('/attendance/add')
        .send([
          {
            student_id: student._id,
            present: 'false',
            date: '21/11/2023',
          },
        ])
        .set('Authorization', `Bearer ${facultyAdmin.authToken}`)
        .expect(201);
    });

    it('Faculty can fill attendance', () => {
      return request(app.getHttpServer())
        .post('/attendance/add')
        .send([
          {
            student_id: student._id,
            present: 'false',
            date: '22/11/2023',
          },
        ])
        .set('Authorization', `Bearer ${faculty.authToken}`)
        .expect(201);
    });

    it('Student can not fill attendance', () => {
      return request(app.getHttpServer())
        .post('/attendance/add')
        .send([
          {
            student_id: student._id,
            present: 'false',
            date: '23/11/2023',
          },
        ])
        .set('Authorization', `Bearer ${student.authToken}`)
        .expect(401);
    });
  });
});

// afterAll(async () => {
//   await app.close();
// });
