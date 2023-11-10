import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let adminToken = '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let studentToken = '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let facultyToken = '';

  describe('Login-STUDENT', () => {
    it('Student login correctly', () => {
      return request(app.getHttpServer())
        .post('/student/login')
        .send({
          studentId: 'S1',
          password: 'student@123',
        })
        .expect(200)
        .then((res) => {
          studentToken = res.body.token;
        });
    });

    it('Student not login correctly', () => {
      return request(app.getHttpServer())
        .post('/student/login')
        .send({
          studentId: 'S1',
          password: 'student@1234',
        })
        .expect(401);
    });
  });

  describe('login-ADMIN', () => {
    it('Admin login correctly', () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          adminId: 'A1',
          password: 'admin@123',
        })
        .expect(200)
        .then((res) => {
          adminToken = res.body.token;
        });
    });
    it('Admin not login correctly', () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          adminId: 'A1',
          password: 'admin@1234',
        })
        .expect(401);
    });
  });

  describe('login-FACULTY', () => {
    it('Faculty login correctly', () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          facultyId: 'F1',
          password: 'faculty@123',
        })
        .expect(200)
        .then((res) => {
          facultyToken = res.body.token;
        });
    });
    it('Admin not login correctly', () => {
      return request(app.getHttpServer())
        .post('/faculty/login')
        .send({
          adminId: 'F1',
          password: 'faculty@1234',
        })
        .expect(401);
    });
  });
});
