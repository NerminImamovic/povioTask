import * as http from 'http';

import {
  PORT,
  NODE_ENV,
  TEST_ENV,
  DEVELOPMENT_ENV,
} from './constants';
import Application from './application';
import logger from './lib/logger';

const server = http.createServer(Application.instance);

if (NODE_ENV !== TEST_ENV) {
  server.listen(PORT, () => {
    if (NODE_ENV === DEVELOPMENT_ENV) {
      logger.info(`Server is listening on http://localhost:${PORT}`);
    }
  });
}
