import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { searchByName } from '../controllers/searchController.js';
import { searchByPhone } from '../controllers/searchController.js'
import { getUserDetailsByPhone } from '../controllers/searchController.js';

const router = express.Router();

// Route to search for contacts by name
router.get('/', authenticateUser, searchByName);
// Route to search for users and contacts by phone number
router.get('/phone', authenticateUser, searchByPhone);
// Route to get user details by phone number
router.get('/user/:phone/details', authenticateUser, getUserDetailsByPhone);
export default router;