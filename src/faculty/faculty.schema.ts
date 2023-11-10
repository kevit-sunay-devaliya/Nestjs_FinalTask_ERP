import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
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

FacultySchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  } catch (error) {}
});
