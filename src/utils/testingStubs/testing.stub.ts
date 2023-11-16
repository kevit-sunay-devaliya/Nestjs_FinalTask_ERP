import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
dotenv.config({ path: '.env.test' });

const departmentId = new mongoose.Types.ObjectId();
const adminFacultyId = new mongoose.Types.ObjectId();
const staffFacultyId = new mongoose.Types.ObjectId();
const studentId = new mongoose.Types.ObjectId();

const departmentOne = {
  _id: departmentId,
  name: 'Information Technology',
  totalSeat: 10,
  initial: 'IT',
};

const facultyAdmin = {
  _id: adminFacultyId,
  name: 'Admin',
  email: 'admin@gmail.com',
  password: 'Admin@123',
  address: 'Rajkot',
  phone_number: 9898989898,
  role: 'Admin',
  authToken: jwt.sign(
    { _id: adminFacultyId, emailId: 'admin@gmail.com' },
    process.env.PRIVATE_KEY,
  ),
};

const facultyStaff = {
  _id: staffFacultyId,
  name: 'DarshanSir',
  email: 'Darshan@gmail.com',
  password: 'Darshan@123',
  address: 'Rajkot',
  phone_number: 9898989898,
  role: 'Faculty',
  authToken: jwt.sign(
    { _id: staffFacultyId, emailId: 'Darshan@gmail.com' },
    process.env.PRIVATE_KEY,
  ),
};

const studentLogin = {
  _id: studentId,
  name: 'Sunay for login',
  email: 'Sunaylogin@gmail.com',
  password: 'Sunaylogin@2023',
  address: 'Rajkot',
  phone_number: 9898424242,
  departmentId: departmentId,
  authToken: jwt.sign(
    {
      _id: studentId,
      emailId: 'Sunaylogin@gmail.com',
    },
    process.env.PRIVATE_KEY,
  ),
  semester: 1,
  batchYear: 2023,
  attendance: [],
};
console.log(process.env.PRIVATE_KEY);
export { departmentOne, facultyAdmin, facultyStaff, studentLogin };
