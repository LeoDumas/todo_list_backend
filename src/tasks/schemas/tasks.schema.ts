import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TaskStatus {
  TODO = 'to do',
  IN_PROGRESS = 'in progress',
  DONE = 'done',
}

@Schema()
export class Tasks extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  responsible: string;

  @Prop({ required: true, enum: TaskStatus })
  status: TaskStatus;
}

export const TasksSchema = SchemaFactory.createForClass(Tasks);
