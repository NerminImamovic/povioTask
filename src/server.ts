import * as http from 'http';

import { PORT, NODE_ENV } from './constants';
import Application from './application';
import logger from './lib/logger';

const server = http.createServer(Application.instance);

if (NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    if (NODE_ENV === 'development') {
      logger.info(`Server is listening on http://localhost:${PORT}`);
    }
  });
}
