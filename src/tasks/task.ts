import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {TaskScheduleType, TaskType} from "./enums";

export type TaskDocument = Task & Document

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
