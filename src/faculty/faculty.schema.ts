import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Faculty {
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

  @Prop({ default: '' })
  authToken: string;
  // tokens: [
  //   {
  //     token: string;
  //   },
  // ];
  @Prop()
  role: string;
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
