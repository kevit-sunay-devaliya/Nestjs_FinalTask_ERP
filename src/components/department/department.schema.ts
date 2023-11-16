import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type departmentModel = HydratedDocument<Department>;
@Schema()
export class Department {
  @Prop()
  name: string;

  @Prop()
  totalSeat: number;

  @Prop()
  initial: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
