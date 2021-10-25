import * as http from 'http';

import { PORT, NODE_ENV } from './constants';
import application from './application';

const server = http.createServer(application.instance);

if (NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server is listening on :${PORT}`);
  });
}
