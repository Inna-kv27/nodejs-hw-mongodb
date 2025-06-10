import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoDB.js';

(async () => {
  await initMongoConnection();
  setupServer();
})();
