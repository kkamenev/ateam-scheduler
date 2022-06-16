
export enum TaskScheduleType { IMMEDIATE = 'IMMEDIATE', SCHEDULED_ONCE = 'SCHEDULED_ONCE', SCHEDULED_CRON = 'SCHEDULED_CRON' }
export enum TaskType { MAIL = 'MAIL', DATA_SYNC = 'DATA_SYNC' }

export type Task = {

  _id?: string;
  name: string;
  type: TaskType;
  scheduleType: TaskScheduleType;
  scheduledTime?: Date;
  cronSchedule?: string;
  params?: any;

}

export function newTask(): Task {
  return {
    name: 'New task',
    type: TaskType.MAIL,
    scheduleType: TaskScheduleType.SCHEDULED_CRON,
    scheduledTime: new Date(),
    cronSchedule: '*    *    *    *    *    *'
  }
}
