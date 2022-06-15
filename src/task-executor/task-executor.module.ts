import {Module} from "@nestjs/common";
import {TaskExecutorService} from "./task-executor.service";
import {TasksModule} from "../tasks/tasks.module";

@Module({
  imports: [TasksModule],
  providers: [TaskExecutorService]
})
export class TaskExecutorModule {}
