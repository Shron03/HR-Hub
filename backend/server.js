import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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
import ticketRoutes from './routes/ticketRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import timeLogRoutes from './routes/timeLogRoutes.js';

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
app.use('/api/tickets', ticketRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/timelogs', timeLogRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HR Hub API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');

if (fs.existsSync(frontendDistPath)) {
  console.log(`[STATIC] Serving production frontend build from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`
      });
    }
    if (req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to HR Hub API',
      version: '1.0.0',
      status: 'active',
      endpoints: [
        '/api/auth',
        '/api/employees',
        '/api/performance',
        '/api/analytics',
        '/api/insights',
        '/api/reports',
        '/api/leaves',
        '/api/feedback',
        '/api/tickets',
        '/api/onboarding',
        '/api/documents',
        '/api/timelogs'
      ]
    });
  });
}

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

    const HOST = process.env.HOST || '0.0.0.0';
    const server = app.listen(PORT, HOST, () => {
      console.log(`HR Hub Backend Server running on http://${HOST}:${PORT}`);
      console.log(`Health Check: http://${HOST}:${PORT}/health`);
    });

    return server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export default app;
