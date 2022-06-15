import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongoDbModule} from "./mongo/mongodb.module";
import {TasksModule} from "./tasks/tasks.module";

@Module({
  imports: [MongoDbModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
