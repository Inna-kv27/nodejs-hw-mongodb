import express from 'express'; // Import Express for creating the server
import cors from 'cors'; // Import CORS for allowing cross-origin requests
import pino from 'pino-http'; // Import pino-http for HTTP request logging
import dotenv from 'dotenv'; // Import dotenv for loading environment variables

// Import the function for initializing the MongoDB connection.
// This file (src/db/initMongoConnection.js) should exist from the previous homework.
import { initMongoConnection } from './db/initMongoDB.js';

// Import the contacts router.
// This router (src/routers/contacts.js) now contains all contact-related routes.
import contactsRouter from './routers/contacts.js';

// Import the middleware for handling non-existent routes (404 Not Found).
// This file (src/middlewares/notFoundHandler.js) is created in Step 2.
import notFoundHandler from './middlewares/notFoundHandler.js';

// Import the middleware for centralized error handling.
// This file (src/middlewares/errorHandler.js) is created in Step 2.
import errorHandler from './middlewares/errorHandler.js';

// Import the utility for safely getting environment variables.
// This file (src/utils/getEnvVar.js) should already exist.
import { getEnvVar } from './utils/getEnvVar.js';

// Load environment variables from the .env file.
dotenv.config();

/**
 * Function to set up the Express server.
 * Includes middleware configuration and route registration.
 * @returns {express.Application} The Express application instance.
 */
export const setupServer = () => {
  const app = express(); // Create an Express application instance

  // Middleware for parsing JSON request bodies.
  // This allows Express to automatically parse incoming JSON data into req.body.
  // It should be placed before CORS and routes that process JSON.
  app.use(express.json());

  // Middleware for allowing cross-origin requests.
  app.use(cors());

  // Middleware for logging HTTP requests using pino-http.
  // Provides pretty-printed logs in the console.
  app.use(
    pino({
      transport: {
        target: 'pino-pretty', // Use pino-pretty for readable output
      },
    }),
  );

  // Mount the contacts router.
  // All requests starting with '/contacts' will now be handled by contactsRouter.
  app.use('/contacts', contactsRouter);

  // **********************************
  // Error handling middleware.
  // These must be placed AFTER all defined routes to catch errors
  // or non-existent routes that were not handled by the main routes.
  // **********************************

  // Middleware for handling non-existent routes (404 Not Found).
  // This middleware should come AFTER all defined routes.
  app.use(notFoundHandler);

  // Middleware for centralized error handling.
  // This middleware must be the LAST in the middleware chain.
  // It catches all errors that are passed using next(err).
  app.use(errorHandler);

  return app; // Return the configured application
};

/**
 * Asynchronous function to start the entire application.
 * Establishes a database connection and starts the server.
 */
async function startApp() {
  try {
    // Establish the MongoDB database connection.
    // Ensure that initMongoConnection.js exists and functions correctly.
    await initMongoConnection();

    // Set up the Express application.
    const app = setupServer();

    // Determine the port on which the server will listen.
    const PORT = getEnvVar('PORT'); // Use your getEnvVar utility

    // Start the server on the defined port.
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Open http://localhost:${PORT}`);
    });
  } catch (error) {
    // Handle errors that may occur during database connection or server startup.
    console.error('Failed to start application:', error.message);
    process.exit(1); // Exit the process with an error code
  }
}

// Start the application.
startApp();
