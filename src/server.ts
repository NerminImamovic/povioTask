import * as http from 'http';

import { PORT, NODE_ENV } from './constants';
import Application from './Application';

const server = http.createServer(Application.instance);

if (NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server is listening on :${PORT}`);
  });
}
