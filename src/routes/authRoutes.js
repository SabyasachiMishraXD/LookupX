import express from 'express';
//import { register } from '../controllers/authController.js';
import { register, login } from '../controllers/authController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();


// Route to register a new user
router.post('/register', register);
// Route to login a user
router.post('/login', login);

// Route to get user details
router.get('/me', authenticateUser, (req, res) => {
    const { id, name, phoneNumber, email } = req.user;
    res.status(200).json({ id, name, phoneNumber, email });
  });

//Forget password and reset password routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;