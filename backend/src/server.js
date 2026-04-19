const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');

// Custom modules
const config = require('./config');
const limiter = require('./lib/rateLimit');
const v1Routes = require('./routes/v1');
const { connectToDatabase, disconnectFromDatabase} = require('./lib/mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  compression({
    threshold: 1024,
  })
);

app.use(helmet());
app.use(limiter);

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

    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

startServer();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    console.log("Server shutdown");
    process.exit(0);
  } catch (err) {
    console.error("Error occured during server shutdown", err);
  }
};

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);