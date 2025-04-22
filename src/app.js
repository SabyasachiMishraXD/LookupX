import express from 'express';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import spamRoutes from './routes/spamRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

//For common route for auth
app.use('/api/auth', authRoutes);
// For common route for contacts
app.use('/api/contacts', contactRoutes);
// For common route for spam
app.use('/api/spam', spamRoutes);

app.use('/api/search', searchRoutes);

export default app;
