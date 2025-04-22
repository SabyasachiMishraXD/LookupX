import express from 'express';
import { importContacts } from '../controllers/contactController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to import contacts
router.post('/import', authenticateUser, importContacts);

export default router;