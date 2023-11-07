import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
