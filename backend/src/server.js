const express = require('express');
const config = require('./config');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});