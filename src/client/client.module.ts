import {MiddlewareConsumer, Module} from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import {ClientMiddleware} from "./client.middleware";

@Module({
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClientMiddleware)
      .forRoutes(ClientController);
  }
}
