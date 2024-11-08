const express = require('express');
const app = express();
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const cors = require('cors');
require('express-async-errors');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

mongoose.set('strictQuery', false);

logger.info('connecting to ', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info('Connected to MongoDB'))
    .catch((error) => logger.error('Error connecting to MongoDB: ', error.message));

app.use(cors())
    .use(express.json())
    .use(middleware.requestLogger)
    .use('/api/blogs', blogRouter)
    .use('/api/users', usersRouter)
    .use('/api/login', loginRouter)
    .use(middleware.unknownEndpoint)
    .use(middleware.errorHandler);

module.exports = app;