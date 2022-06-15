import {Injectable} from "@nestjs/common";
import {Task, TaskDocument} from "./task";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class TaskService {

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  getAll(): Promise<TaskDocument[]> {
    return this.taskModel.find().exec();
  }

  async createNew(task: Task): Promise<TaskDocument> {
    return (await this.taskModel.create(task)).save();
  }

  async save(id: string, task: Task) {
    return this.taskModel.findByIdAndUpdate(id, task, { upsert: true, new: true });
  }

  delete(id: string): Promise<undefined> {
    return this.taskModel.deleteOne({_id: id}).exec().then(() => undefined);
  }
}
