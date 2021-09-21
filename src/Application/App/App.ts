import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { config } from '../Config/Config';
import { IController } from '../Controller/IController';
import { IApp } from './IApp';

export class App implements IApp {
  private app: Express;

  constructor(private readonly controllers: ControllerWithRoute[]) {
    this.app = express();
    this.configureApp();
  }

  start(): void {
    this.app.listen(config.port, () => {
      // @todo replace console.log with proper loggerf
      console.log(`Application is listening on port: ${config.port}`); // eslint-disable-line
    });
  }

  private configureApp(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());

    this.configureRouting();
  }

  private configureRouting(): void {
    this.controllers.forEach(([route, controller]) => {
      this.app.use(route, controller.getRouter());
    });
  }
}

export type ControllerWithRoute = [string, IController];