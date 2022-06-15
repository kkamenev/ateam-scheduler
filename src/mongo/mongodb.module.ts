import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forRoot('mongodb://ubltpwhfbkykqqht0wrj:dDR6zxMqW4PUe3nAdVWQ@' +
    'n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,' +
    'n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017' +
    '/bvmr3pheeg8hooz?replicaSet=rs0')],
})
export class MongoDbModule {
}
