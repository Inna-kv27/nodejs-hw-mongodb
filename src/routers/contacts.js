import express from 'express'; // Import Express for creating the Router object

// Import controllers that will handle requests for each route.
// These controllers (src/controllers/contacts.js) are now wrapped with ctrlWrapper.
import {
  getAllContactsController,
  getContactByIdController,
  // These controllers for POST, PATCH, DELETE are still placeholders
  // and will be fully implemented in subsequent steps (Steps 3, 4, 5).
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

// Import the controller wrapper utility.
// This file (src/utils/ctrlWrapper.js) is created in Step 2.
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router(); // Create a new instance of Router

// Route for getting all contacts: GET /contacts
// The controller is wrapped with ctrlWrapper to handle asynchronous errors.
router.get('/', ctrlWrapper(getAllContactsController));

// Route for getting a contact by ID: GET /contacts/:contactId
// The controller is wrapped with ctrlWrapper.
router.get('/:contactId', ctrlWrapper(getContactByIdController));

// Route for creating a new contact: POST /contacts
// This route will be fully implemented in Step 3.
router.post('/', ctrlWrapper(createContactController));

// Route for updating an existing contact: PATCH /contacts/:contactId
// This route will be fully implemented in Step 4.
router.patch('/:contactId', ctrlWrapper(updateContactController));

// Route for deleting an existing contact: DELETE /contacts/:contactId
// This route will be fully implemented in Step 5.
router.delete('/:contactId', ctrlWrapper(deleteContactController));

// Export the configured router for use in src/server.js
export default router;
