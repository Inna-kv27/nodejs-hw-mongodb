import dotenv from 'dotenv'; // Залишаємо імпорт, якщо він використовується десь ще, але виклик config видаляємо
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoDB.js';
import { getEnvVar } from './utils/getEnvVar.js';

// ВИДАЛЕНО: dotenv.config({ path: './.env' }); // Цей виклик тепер відбувається через скрипт dev

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
