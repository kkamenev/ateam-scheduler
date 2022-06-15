import {Injectable} from "@nestjs/common";
import {Task, TaskDocument} from "./task";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {EventEmitter} from "events";

const CREATE_EVENT = 'create';
const DELETE_EVENT = 'delete';
const UPDATE_EVENT = 'update';

@Injectable()
export class TaskService {

  private eventEmitter = new EventEmitter();

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  getAll(): Promise<TaskDocument[]> {
    return this.taskModel.find().exec();
  }

  async createNew(task: Task): Promise<TaskDocument> {
    const savedTask = await (await this.taskModel.create(task)).save();
    this.eventEmitter.emit(CREATE_EVENT, savedTask);
    return savedTask;
  }

  async save(id: string, task: Task): Promise<TaskDocument> {
    const savedTask = await this.taskModel.findByIdAndUpdate(id, task, { upsert: true, new: true });
    this.eventEmitter.emit(UPDATE_EVENT, savedTask);
    return savedTask;
  }

  async delete(id: string): Promise<void> {
    await this.taskModel.deleteOne({_id: id}).exec();
    this.eventEmitter.emit(DELETE_EVENT, id);
  }

  async deleteWithoutEvents(id: string): Promise<void> {
    await this.taskModel.deleteOne({_id: id}).exec();
  }

  onTaskCreated(callback: (task: TaskDocument) => any) {
    this.eventEmitter.on(CREATE_EVENT, callback);
  }

  onTaskUpdated(callback: (task: TaskDocument) => any) {
    this.eventEmitter.on(UPDATE_EVENT, callback);
  }

  onTaskDeleted(callback: (taskId: string) => any) {
    this.eventEmitter.on(DELETE_EVENT, callback);
  }
}
