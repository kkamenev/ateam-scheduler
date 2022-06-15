import {TaskService} from "../tasks/task.service";
import {Inject, Injectable} from "@nestjs/common";
import {TaskDocument, TaskScheduleType, TaskType} from "../tasks/task";
import {sendMail, syncData} from "./tasks";

const scheduler = require('node-schedule');

const MAX_CONCURRENT_TASKS = 3;

@Injectable()
export class TaskExecutorService {

  private runningTaskCount = 0;
  private taskQueue: TaskDocument[] = [];

  constructor(@Inject(TaskService) private readonly taskService: TaskService) {

    this.init();
  }

  async init() {
    const tasks = await this.taskService.getAll();
    tasks.forEach(task => {
      console.log(`Handling task '${task.name}', running tasks: ${this.runningTaskCount}`);
      switch (task.scheduleType) {
        case TaskScheduleType.IMMEDIATE:
          this.executeImmediately(task);
          break;
        case TaskScheduleType.SCHEDULED_ONCE:
          this.scheduleOnce(task);
          break;
        case TaskScheduleType.SCHEDULED_CRON:
          this.scheduleCron(task);
          break;
      }
    });
  }

  private async executeImmediately(task: TaskDocument) {
    if (this.runningTaskCount < MAX_CONCURRENT_TASKS) {
      this.runningTaskCount++;
      console.log(`Executing task '${task.name}'`);
      try {
        switch (task.type) {
          case TaskType.MAIL:
            await sendMail(task.params.emailAddress);
            break;
          case TaskType.DATA_SYNC:
            await syncData();
            break;
        }
      } catch (e) {
        console.error(`Task execution failed: ${e}`);
      } finally {
        this.runningTaskCount--;
        this.onTaskExecutionCompleted(task);
      }
    } else {
      console.log(`Task '${task.name}' execution postponed due to high load`);
      this.taskQueue.push(task);
    }
  }

  private scheduleOnce(task: TaskDocument) {
    if (task.scheduledTime > new Date()) {
      scheduler.scheduleJob(task.scheduledTime, () => this.executeTaskWithErrorHandling(task));
    } else {
      console.log(`Scheduled time is in the past for '${task.name}', executing immediately`);
      this.executeTaskWithErrorHandling(task);
    }
  }

  private scheduleCron(task: TaskDocument) {
    scheduler.scheduleJob(task.cronSchedule, () => this.executeTaskWithErrorHandling(task));
  }

  private onTaskExecutionCompleted(task: TaskDocument) {
    if (task.scheduleType === TaskScheduleType.IMMEDIATE || task.scheduleType === TaskScheduleType.SCHEDULED_ONCE) {
      this.taskService.delete(task._id)
        .then(() => {
          console.log(`Task '${task.name}' removed from DB`);
        })
        .catch(e => {
          console.error(`Failed to remove task '${task.name}' from DB. Unwanted executions possible. ${e}`);
        });
    }
    if (this.runningTaskCount < MAX_CONCURRENT_TASKS && this.taskQueue.length > 0) {
      console.log('Picking up next task from in-mem queue');
      const nextTask = this.taskQueue.splice(0, 1)[0];
      this.executeTaskWithErrorHandling(nextTask);
    }
  }

  private executeTaskWithErrorHandling(task: TaskDocument) {
    this.executeImmediately(task)
      .catch(e => {
        console.error(`Failed to execute task '${task.name}'. ${e}`);
      });
  }
}
