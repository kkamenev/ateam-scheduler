import {Module} from '@nestjs/common';
import {MongoDbModule} from "./mongo/mongodb.module";
import {TasksModule} from "./tasks/tasks.module";
import {TaskExecutorModule} from "./task-executor/task-executor.module";
import {ClientModule} from './client/client.module';

@Module({
  imports: [MongoDbModule, TasksModule, TaskExecutorModule, ClientModule],
})
export class AppModule {}
