import {Document} from "mongoose";
import {SchemaFactory, Schema, Prop} from "@nestjs/mongoose";

export type TaskDocument = Task & Document

export enum TaskType { IMMEDIATE = 'IMMEDIATE', SCHEDULED_ONCE = 'ONCE', SCHEDULED_CRON = 'SCHEDULED_CRON' };

@Schema()
export class Task {

  @Prop()
  name: string;
  @Prop()
  type: TaskType;
  @Prop()
  scheduledTime: Date;
  @Prop()
  cronSchedule: string;

}

export const TaskSchema = SchemaFactory.createForClass(Task);
