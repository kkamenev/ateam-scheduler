import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {Task, TaskDocument} from "./task";
import {TaskService} from "./task.service";


@Controller('/api/tasks')
export class TaskController {

  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAllTasks(): Promise<TaskDocument[]> {
    return this.taskService.getAll();
  }

  @Post()
  createTask(@Body() task: Task): Promise<TaskDocument> {
    return this.taskService.createNew(task);
  }

  @Put('/:id')
  updateTask(@Param() params, @Body() task: Task): Promise<Task> {
    return this.taskService.save(params['id'], task);
  }

  @Delete('/:id')
  deleteTask(@Param() params): Promise<Task> {
    return this.taskService.delete(params['id']);
  }

}
