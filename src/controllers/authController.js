import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import {generateToken} from '../config/jwt.js';
import { registerSchema , loginSchema } from '../validators/authValidator.js';
import otpStore from '../utils/otpStore.js';

const prisma = new PrismaClient();

// Function to register a new user
export const register = async (req, res) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.errors });
      }
  
      const name = parsed.data.name.toLowerCase();
      const { phoneNumber, email, password } = parsed.data;
  
      const existingUser = await prisma.user.findUnique({
        where: { phoneNumber },
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await prisma.user.create({
        data: { name, phoneNumber, email, password: hashedPassword },
      });
  
      const token = generateToken(user);
      res.status(201).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Function to login a user
export const login = async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.errors });
      }
  
      const { phoneNumber, password } = parsed.data;
  
      // Check user exists
      const user = await prisma.user.findUnique({ where: { phoneNumber } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid phone number or password' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid phone number or password' });
      }
  
      // Return JWT token
      const token = generateToken(user);
      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};
  

//Function for forgot password
export const forgotPassword = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

  const user = await prisma.user.findUnique({ where: { phoneNumber } });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  otpStore[phoneNumber] = { code: otp, expiresAt };

  console.log(` OTP for ${phoneNumber}: ${otp}`); // simulate SMS

  res.status(200).json({ message: 'OTP sent to your registered number (simulated)' });
};

//Function to reset password
export const resetPassword = async (req, res) => {
  const { phoneNumber, otp, newPassword } = req.body;

  const entry = otpStore[phoneNumber];

  if (!entry || entry.code !== otp || Date.now() > entry.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { phoneNumber },
    data: { password: hashed }
  });

  delete otpStore[phoneNumber];

  res.status(200).json({ message: 'Password reset successful!' });
};
