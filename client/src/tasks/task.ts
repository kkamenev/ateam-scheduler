import {TaskScheduleType, TaskType} from "../../../src/tasks/enums";

export type Task = {

  _id: string;
  name: string;
  params: any;
  type: TaskType;
  scheduleType: TaskScheduleType;
  scheduledTime: Date;
  cronSchedule: string;

}
