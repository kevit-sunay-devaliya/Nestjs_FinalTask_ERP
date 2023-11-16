import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './student.schema';
// import { CreateStudentDto } from './dtos/create-student.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  create(body) {
    return this.studentModel.create(body);
    // return this.studentModel.save(student);
  }
  findStudentByEmailId(emailId) {
    return this.studentModel.findOne({ emailId });
  }

  findStudents() {
    return this.studentModel.find();
  }

  async findStudent(id: string) {
    try {
      const student = await this.studentModel.findById(id);
      if (!student) {
        throw new NotFoundException('NOT FOUND!');
      }
      return student;
    } catch (error) {
      throw new NotFoundException('NOT FOUND!');
    }
  }

  // find(email: string) {
  //   return this.studentModel.find({ email });
  // }

  async update(id: string, attrs: Partial<Student>) {
    try {
      const student = await this.studentModel.findByIdAndUpdate(id, attrs, {
        new: true,
        runValidators: true,
      });
      if (!student) {
        throw new NotFoundException('NOT FOUND!');
      }
      return student;
    } catch (error) {
      throw new NotFoundException('NOT FOUND!');
    }
  }

  async delete(id: string) {
    try {
      const student = await this.studentModel.findByIdAndDelete(id);
      if (!student) {
        throw new NotFoundException('Not Found');
      }
      return student;
    } catch (error) {
      throw new NotFoundException('NOT FOUND!');
    }
  }

  async getBatchDepartmentWiseData() {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'departments',
            localField: 'departmentId',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $unwind: {
            path: '$result',
          },
        },
        {
          $group: {
            _id: {
              batchYear: '$batchYear',
              department: '$result.initial',
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $addFields: {
            TotalYearCount: '$count',
          },
        },
        {
          $group: {
            _id: '$_id.batchYear',
            branches: {
              $push: {
                dep: '$_id.department',
                totalStudent: '$count',
              },
            },
          },
        },
        {
          $addFields: {
            TotalStudents: {
              $reduce: {
                input: '$branches',
                initialValue: 0,
                in: {
                  $add: ['$$value', '$$this.totalStudent'],
                },
              },
            },
          },
        },
        {
          $addFields: {
            year: '$_id',
          },
        },
        {
          $project: {
            data: {
              $map: {
                input: '$branches',
                as: 'branch',
                in: {
                  k: '$$branch.dep',
                  v: '$$branch.totalStudent',
                },
              },
            },
            _id: 0,
            year: 1,
            TotalStudents: 1,
          },
        },
        {
          $project: {
            branches: {
              $arrayToObject: '$data',
            },
            year: 1,
            TotalStudents: 1,
          },
        },
      ];

      const data = await this.studentModel
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec();
      // const data = await mongoose
      //   .model('Student')
      //   .aggregate(pipeline)
      //   .allowDiskUse(true)
      //   .exec();

      return data;
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAbsentStudentBatchYearSemesterDateWise(requestBody: {
    [key: string]: any;
  }) {
    try {
      const pipeline: any = [
        {
          $lookup: {
            from: 'departments',
            localField: 'departmentId',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $unwind: {
            path: '$result',
          },
        },
        {
          $project: {
            Absent: {
              $filter: {
                input: '$attendance',
                as: 'attObj',
                cond: {
                  $and: [
                    {
                      $eq: ['$$attObj.present', 'false'],
                    },
                    {
                      $eq: ['$$attObj.date', requestBody.date],
                    },
                  ],
                },
              },
            },
            name: 1,
            address: 1,
            batchYear: 1,
            semester: 1,
            emailId: 1,
            Department: '$result.name',
            DepartmentInitial: '$result.initial',
          },
        },
        {
          $match: {
            $expr: {
              $gt: [
                {
                  $size: '$Absent',
                },
                0,
              ],
            },
          },
        },
      ];
      if (requestBody.batch) {
        const object = {
          $match: {
            batchYear: requestBody.batch,
          },
        };
        pipeline.unshift(object);
      }
      if (requestBody.branch) {
        const object = {
          $match: {
            'result.initial': requestBody.branch,
          },
        };
        pipeline.splice(2, 0, object);
      }
      if (requestBody.semester) {
        const object = {
          $match: {
            semester: requestBody.semester,
          },
        };
        pipeline.unshift(object);
      }
      const data = await this.studentModel
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec();
      return data;
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMoreThen75PercentStudent(requestBody: { [key: string]: any }) {
    try {
      const pipeline: any = [
        {
          $lookup: {
            from: 'departments',
            localField: 'departmentId',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $unwind: {
            path: '$result',
          },
        },
        {
          $project: {
            totalAttendanceDay: {
              $size: '$attendance',
            },
            customArr: {
              $filter: {
                input: '$attendance',
                as: 'attObj',
                cond: {
                  $and: [
                    {
                      $eq: ['$$attObj.present', 'true'],
                    },
                  ],
                },
              },
            },
            name: 1,
            Department: '$result.initial',
            emailId: 1,
            address: 1,
            semester: 1,
            batchYear: 1,
          },
        },
        {
          $addFields: {
            presentAttendanceDay: {
              $size: '$customArr',
            },
          },
        },
        {
          $addFields: {
            percentage: {
              $multiply: [
                {
                  $divide: ['$presentAttendanceDay', '$totalAttendanceDay'],
                },
                100,
              ],
            },
          },
        },
        {
          $match: {
            percentage: {
              $gt: 75,
            },
          },
        },
        {
          $project: {
            customArr: 0,
            presentAttendanceDay: 0,
            totalAttendanceDay: 0,
          },
        },
      ];
      if (requestBody.batch) {
        const object = {
          $match: {
            batchYear: requestBody.batch,
          },
        };
        pipeline.unshift(object);
      }
      if (requestBody.branch) {
        const object = {
          $match: {
            'result.initial': requestBody.branch,
          },
        };
        pipeline.splice(2, 0, object);
      }
      if (requestBody.semester) {
        const object = {
          $match: {
            semester: requestBody.semester,
          },
        };
        pipeline.unshift(object);
      }
      const data = await this.studentModel
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec();
      return data;
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getVacancySeat(requestBody) {
    try {
      const pipeline: any = [
        {
          $lookup: {
            from: 'departments',
            localField: 'departmentId',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $unwind: {
            path: '$result',
          },
        },
        {
          $group: {
            _id: {
              batchYear: '$batchYear',
              department: '$result.initial',
            },
            count: {
              $sum: 1,
            },
            departmentTotalSeat: {
              $first: '$result.totalSeat',
            },
          },
        },
        {
          $group: {
            _id: '$_id.batchYear',
            branches: {
              $push: {
                dep: '$_id.department',
                totalStudent: '$count',
                totalStudentsIntake: '$departmentTotalSeat',
              },
            },
          },
        },
        {
          $addFields: {
            TotalStudents: {
              $reduce: {
                input: '$branches',
                initialValue: 0,
                in: {
                  $add: ['$$value', '$$this.totalStudent'],
                },
              },
            },
            TotalStudentsIntake: {
              $reduce: {
                input: '$branches',
                initialValue: 0,
                in: {
                  $add: ['$$value', '$$this.totalStudentsIntake'],
                },
              },
            },
          },
        },
        {
          $addFields: {
            year: '$_id',
          },
        },
        {
          $project: {
            _id: 0,
            AvailableSeat: {
              $subtract: ['$TotalStudentsIntake', '$TotalStudents'],
            },
            branches: 1,
            TotalStudents: 1,
            TotalStudentsIntake: 1,
            year: 1,
          },
        },
        {
          $project: {
            data: {
              $map: {
                input: '$branches',
                as: 'branch',
                in: {
                  k: '$$branch.dep',
                  v: {
                    totalStudent: '$$branch.totalStudent',
                    totalStudentsIntake: '$$branch.totalStudentsIntake',
                    availableStudent: {
                      $subtract: [
                        '$$branch.totalStudentsIntake',
                        '$$branch.totalStudent',
                      ],
                    },
                  },
                },
              },
            },
            year: 1,
            TotalStudents: 1,
            TotalStudentsIntake: 1,
            AvailableSeat: 1,
          },
        },
        {
          $project: {
            branches: {
              $arrayToObject: '$data',
            },
            year: 1,
            TotalStudents: 1,
            TotalStudentsIntake: 1,
          },
        },
      ];
      if (requestBody.batch) {
        const object = {
          $match: {
            batchYear: requestBody.batch,
          },
        };
        pipeline.unshift(object);
      }
      if (requestBody.branch) {
        const object = {
          $match: {
            'result.initial': requestBody.branch,
          },
        };
        pipeline.splice(2, 0, object);
      }
      const data = await this.studentModel
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec();
      return data;
    } catch (error) {
      throw new HttpException(
        'Internal server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  clearStudent() {
    return this.studentModel.deleteMany();
  }
}
