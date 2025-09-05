const express = require('express');
const dotenv = require('dotenv');
const productsRouter = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { logInfo } = require('./utils/logger');

dotenv.config();

const app = express();

// Core middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigin = process.env.CORS_ORIGIN || '*';
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});

// Simple request logger
app.use((req, res, next) => {
  logInfo(`${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/products', productsRouter);

// 404 handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use(errorHandler);

module.exports = app;

