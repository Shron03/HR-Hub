import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Employee from './models/Employee.js';
import { seedDatabase } from './seed.js';

import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HR Hub API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to HR Hub API',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/employees',
      '/api/performance',
      '/api/analytics',
      '/api/insights',
      '/api/reports',
      '/api/leaves',
      '/api/feedback'
    ]
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server and Auto-Seed if empty
const startServer = async () => {
  try {
    await connectDB();

    // Check if initial seed is needed
    const count = await Employee.countDocuments();
    if (count === 0) {
      console.log('Database empty on startup. Auto-seeding initial HR Hub dataset...');
      await seedDatabase();
    } else {
      console.log(`Database already populated with ${count} employee records.`);
    }

    const server = app.listen(PORT, () => {
      console.log(`HR Hub Backend Server running on port ${PORT}`);
      console.log(`Health Check: http://localhost:${PORT}/health`);
    });

    return server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export default app;
