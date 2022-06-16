import {TaskService} from "../tasks/task.service";
import {Inject, Injectable} from "@nestjs/common";
import {sendMail, syncData} from "./tasks";
import {Job} from "node-schedule";
import {TaskDocument} from "../tasks/task";
import {TaskScheduleType, TaskType} from "../tasks/enums";

const scheduler = require('node-schedule');

const MAX_CONCURRENT_TASKS = 3;

@Injectable()
export class TaskExecutorService {

  private runningTaskCount = 0;
  private taskQueue: TaskDocument[] = [];
  private jobByTaskId: Map<string, Job> = new Map<string, Job>();

  constructor(@Inject(TaskService) private readonly taskService: TaskService) {
    this.init()
      .catch(e => {
        console.error('Failed to initialize TaskExecutor ' + e);
      });
  }

  async init() {
    this.subscribeToTaskEvents();
    const tasks = await this.taskService.getAll();
    tasks.forEach(task => this.scheduleOrExecuteTask(task));
  }

  private scheduleOrExecuteTask(task: TaskDocument) {
    console.log(`Handling task '${task.name}', running tasks: ${this.runningTaskCount}`);
    switch (task.scheduleType) {
      case TaskScheduleType.IMMEDIATE:
        this.executeTaskWithErrorHandling(task);
        break;
      case TaskScheduleType.SCHEDULED_ONCE:
        this.scheduleOnce(task);
        break;
      case TaskScheduleType.SCHEDULED_CRON:
        this.scheduleCron(task);
        break;
    }
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
      const job = scheduler.scheduleJob(task.scheduledTime, () => this.executeTaskWithErrorHandling(task));
      this.jobByTaskId.set(task._id.toString(), job);
    } else {
      console.log(`Scheduled time is in the past for '${task.name}', executing immediately`);
      this.executeTaskWithErrorHandling(task);
    }
  }

  private scheduleCron(task: TaskDocument) {
    const job = scheduler.scheduleJob(task.cronSchedule, () => this.executeTaskWithErrorHandling(task));
    this.jobByTaskId.set(task._id.toString(), job);
  }

  private onTaskExecutionCompleted(task: TaskDocument) {
    if (task.scheduleType === TaskScheduleType.IMMEDIATE || task.scheduleType === TaskScheduleType.SCHEDULED_ONCE) {
      this.taskService.deleteWithoutEvents(task._id)
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

  private subscribeToTaskEvents() {
    this.taskService.onTaskCreated(task => this.scheduleOrExecuteTask(task));
    this.taskService.onTaskDeleted(taskId => this.onTaskDeleted(taskId));
    this.taskService.onTaskUpdated(task => this.onTaskUpdated(task));
  }

  private onTaskDeleted(taskId: string) {
    const job = this.jobByTaskId.get(taskId);
    if (job) {
      job.cancel();
    }
    this.taskQueue = this.taskQueue.filter(task => task._id !== taskId);
  }

  private onTaskUpdated(task: TaskDocument) {
    this.onTaskDeleted(task._id);
    this.scheduleOrExecuteTask(task);
  }

}
