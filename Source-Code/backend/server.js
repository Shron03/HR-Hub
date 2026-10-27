import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import './config/jwt.js'; // Validate JWT configuration on startup
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

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Configurable CORS Allowlist with automatic support for Render, Vercel, and local dev
const rawClientUrl = process.env.CLIENT_URL || '';
const configuredOrigins = rawClientUrl
  ? rawClientUrl.split(',').map(s => s.trim().replace(/\/$/, ''))
  : [];

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow same-origin or non-browser requests

  // Local development origins
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }

  // Render cloud deployments (*.onrender.com)
  if (/^https:\/\/.*\.onrender\.com$/.test(origin)) {
    return true;
  }

  // Vercel cloud deployments (*.vercel.app)
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
    return true;
  }

  // Explicitly configured origins from CLIENT_URL
  if (configuredOrigins.includes(origin) || configuredOrigins.includes('*')) {
    return true;
  }

  // If CLIENT_URL is not explicitly configured, permit demo access
  if (configuredOrigins.length === 0) {
    return true;
  }

  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

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

// Health check endpoint (Public)
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
      status: 'active'
    });
  });
}

// Centralized Secure Error Handling Middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', err.stack);
  } else {
    console.error('API Error:', err.message);
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: (process.env.NODE_ENV === 'production' && statusCode === 500)
      ? 'An unexpected internal server error occurred.'
      : (err.message || 'Internal Server Error')
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
