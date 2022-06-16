import {Injectable, NestMiddleware} from "@nestjs/common";
import {ClientService} from "./client.service";
import { Request, Response } from 'express';
import * as path from 'path';
import {CLIENT_BUILD_DIR} from "./config";

@Injectable()
export class ClientMiddleware implements NestMiddleware {
  constructor(private readonly clientService: ClientService) {}

  async use(req: Request, res: Response, next: () => void) {
    if (/[^\\/]+\.[^\\/]+$/.test(req.path)) {
      const file = this.getAssetPath(req.path);
      res.sendFile(file, (err) => {
        if (err) {
          res.status(500).end();
        }
      });
    } else {
      return next();
    }
  }

  getAssetPath(url: any): string {
    return path.resolve(path.join(CLIENT_BUILD_DIR, url));
  }
}
