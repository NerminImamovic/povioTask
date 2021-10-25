import * as http from 'http';

import { PORT } from './constants';
import application from './application';

const server = http.createServer(application.instance);

server.listen(PORT, () => {
  console.log(`Server is listening on :${PORT}`);
});
