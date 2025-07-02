import dotenv from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoDB.js';
import { getEnvVar } from './utils/getEnvVar.js';

dotenv.config();

(async () => {
  try {
    await initMongoConnection();

    const app = setupServer();

    const PORT = getEnvVar('PORT');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Open http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start application:', error.message);
    process.exit(1);
  }
})();
