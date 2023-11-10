import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
// import { Types } from 'mongoose';
@Schema()
export class Student {
  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone_number: number;

  @Prop({ required: true })
  password: string;

  @Prop()
  address: string;

  @Prop()
  semester: number;

  @Prop()
  batchYear: number;

  @Prop({ type: 'ObjectId', ref: 'Department' }) // Reference to the Department model
  departmentId: string;

  @Prop({ default: '' })
  authToken: string;
  // tokens: [
  //   {
  //     token: string;
  //   },
  // ];
  @Prop([{ student_id: String, date: String, present: String }])
  attendance: { student_id: string; date: string; present: string }[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  } catch (error) {}
});
