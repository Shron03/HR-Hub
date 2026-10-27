import crypto from 'crypto';
import jwt from 'jsonwebtoken';

let secret = process.env.JWT_SECRET;

if (!secret || secret.trim() === '') {
  // Generate a cryptographically secure random 256-bit secret per process
  secret = crypto.randomBytes(32).toString('hex');
  console.warn('[SECURITY NOTICE] JWT_SECRET environment variable is not set. Generated a cryptographically secure 256-bit process secret for this instance. Configure JWT_SECRET in your dashboard to persist sessions across redeploys.');
}

export const JWT_SECRET = secret;

export const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
