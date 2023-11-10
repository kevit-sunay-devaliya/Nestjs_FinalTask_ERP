import { studentStub } from '../test/stubs/student.stub';

export const StudentService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(studentStub()),
  findStudentByEmailId: jest.fn().mockResolvedValue(studentStub()),
  findStudents: jest.fn().mockResolvedValue([studentStub()]),
  findStudent: jest.fn().mockResolvedValue(studentStub()),
  update: jest.fn().mockResolvedValue(studentStub()),
  delete: jest.fn().mockResolvedValue(studentStub()),
});
