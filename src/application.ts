import express, { Application as ExpressApplication, Handler } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';

import userRoutes from './routes/UserRoutes';
import * as swaggerDocument from '../swagger.json';

class Application {
  private readonly _instance: ExpressApplication;

  get instance(): ExpressApplication {
    return this._instance;
  }

  constructor() {
    this.connectDatabase();
    this._instance = express();
    this._instance.use(express.json());
    this._instance.use(bodyParser.json());
    this._instance.use(bodyParser.urlencoded({ extended: true }));
    this.registerRouters();
  }

  private registerRouters() {
    this._instance.use(userRoutes);

    this._instance.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private async connectDatabase() {
    // console.log(`ENV ${JSON.stringify(process.env.MONGO_URL)}`);

    if (process.env.NODE_ENV !== 'test') {
      await mongoose.connect('mongodb://localhost:27017/users');
    }
  }
}

export default new Application();
