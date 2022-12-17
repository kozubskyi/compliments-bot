const express = require('express');
const serverless = require('serverless-http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const controllers = require('./controllers');

const app = express();

dotenv.config();
const { PORT = 4001, MONGODB_URI } = process.env;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
  })
  .catch(err => {
    console.log('❌ Error:', err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

const NETLIFY_BASE_URL = '/.netlify/functions/api';

app.use(`${NETLIFY_BASE_URL}/users`, controllers.users);
app.use(`${NETLIFY_BASE_URL}/compliments`, controllers.compliments);
app.use('*', (req, res) => {
  res.status(400).send({ message: "This endpoint isn't correct" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message });
});

module.exports.handler = serverless(app);
