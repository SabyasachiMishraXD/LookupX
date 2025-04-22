import express from 'express';
import { markSpam } from '../controllers/spamController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to mark a contact as spam
router.post('/', authenticateUser, markSpam);

export default router;
