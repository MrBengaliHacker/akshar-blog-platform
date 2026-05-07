const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

// Custom modules
const config = require('./config');
const limiter = require('./lib/rateLimit');
const { connectToDatabase, disconnectFromDatabase} = require('./lib/mongoose');
const logger = require('./lib/logger');
const swaggerSpec = require('./lib/swagger');

const v1Routes = require('./routes/v1');

const app = express();

// Request size limit — prevents large payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Performance and security
app.use(
  compression({
    threshold: 1024,
  })
);
app.use(helmet());
app.use(limiter);

// Cors
const corsOptions = {
  origin: function (origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin || 
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

app.use(cors(corsOptions));

const startServer = async () => {
  try {
    await connectToDatabase();

    // API routes
    app.use('/api/v1', v1Routes);

    // Swagger docs
    app.use(
      '/api/v1/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customSiteTitle: 'Akshar Blog API Docs',
        customCss: '.swagger-ui .topbar { display: none }',
      })
    );

    // Handle undefined routes
    app.use((req, res) => {
      res.status(404).json({
        code: 'NotFound',
        message: `Route ${req.method} ${req.url} not found`,
        api: '/api/v1',
        docs: '/api/v1/docs',
      });
    });

    app.listen(config.PORT, () => {
      logger.info(`Server is running on http://localhost:${config.PORT}`);
      logger.info(`API base URL: http://localhost:${config.PORT}/api/v1`);
      logger.info(`API docs: http://localhost:${config.PORT}/api/v1/docs`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

startServer();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn("Server shutdown");
    process.exit(0);
  } catch (err) {
    logger.error("Error occured during server shutdown", err);
  }
};

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);