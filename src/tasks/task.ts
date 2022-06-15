import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type TaskDocument = Task & Document

export enum TaskScheduleType { IMMEDIATE = 'IMMEDIATE', SCHEDULED_ONCE = 'SCHEDULED_ONCE', SCHEDULED_CRON = 'SCHEDULED_CRON' }
export enum TaskType { MAIL = 'MAIL', DATA_SYNC = 'DATA_SYNC' }

@Schema()
export class Task {

  @Prop()
  name: string;
  @Prop({type: Object})
  params: any;
  @Prop()
  type: TaskType;
  @Prop()
  scheduleType: TaskScheduleType;
  @Prop()
  scheduledTime: Date;
  @Prop()
  cronSchedule: string;

}

export const TaskSchema = SchemaFactory.createForClass(Task);
