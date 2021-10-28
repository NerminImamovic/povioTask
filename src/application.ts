import express, { Application as ExpressApplication } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import {
  NODE_ENV,
  MONGO_URL,
  TEST_ENV,
} from './constants';
import userRoutes from './routes/UserRoutes';
import * as swaggerDocument from '../swagger.json';
import logger from './lib/logger';

class Application {
  private readonly _instance: ExpressApplication;

  public constructor() {
    this.connectDatabase();
    this._instance = express();
    this._instance.use(cors());
    this._instance.use(express.json());
    this._instance.use(bodyParser.json());
    this._instance.use(bodyParser.urlencoded({ extended: true }));
    this.registerRouters();
  }

  public get instance(): ExpressApplication {
    return this._instance;
  }

  private registerRouters() {
    this._instance.use(userRoutes);

    this._instance.get('/', (req, res) => {
      res.redirect('/api-docs');
    });

    this._instance.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private async connectDatabase() {
    if (NODE_ENV !== TEST_ENV) {
      await mongoose.connect(MONGO_URL);
      logger.info('Database successfully connected');
    }
  }
}

export default new Application();
