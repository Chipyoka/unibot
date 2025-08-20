const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { httpLogger } = require('./utils/logger');
const env = require('./config/environment');
const { sequelize } = require('./models');

const app = express();

// Core security & parsing
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(httpLogger);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', env: env.nodeEnv }));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/chat', require('./routes/chat'));
app.use('/api/v1/analytics', require('./routes/analytics'));
app.use('/api/v1/assessment', require('./routes/assessment'));

// Boot
async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connection established');
    app.listen(env.port, () => console.log(`API listening on :${env.port}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

start();

module.exports = app;
