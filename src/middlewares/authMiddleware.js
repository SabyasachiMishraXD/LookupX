import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Middleware to authenticate user using JWT
export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // Attach user to request
    next();// Go to controller
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
