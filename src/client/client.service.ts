import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {CLIENT_BUILD_DIR} from "./config";

@Injectable()
export class ClientService {

  public async getApp() {
    const filePath = path.resolve(path.join(CLIENT_BUILD_DIR, 'index.html'));
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
