import crypto from 'crypto';
import jwt from 'jsonwebtoken';

let secret = process.env.JWT_SECRET;

if (!secret || secret.trim() === '') {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is missing in production environment. Application cannot start securely.');
  }
  // For development and test environments, generate a secure random 32-byte secret per process execution
  console.warn('[SECURITY WARNING] JWT_SECRET is not configured in environment. Generated an ephemeral in-process random secret for development/testing.');
  secret = crypto.randomBytes(32).toString('hex');
}

export const JWT_SECRET = secret;

export const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
