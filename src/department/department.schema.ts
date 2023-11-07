import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
