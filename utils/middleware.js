const logger = require('./logger');

// manejador de errores de express
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }

    next(error);
};

// middleware para endpoints desconocidos
const unknownEndpoint = (req, res) => {
    res.status(400).send({ error: 'unknown endpoint' });
};

//middleware para loggear las peticiones
const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method);
    logger.info('Path:  ', req.path);
    logger.info('Body:  ', req.body);
    logger.info('-----');
    next();
};

module.exports = {
    errorHandler,
    unknownEndpoint,
    requestLogger
};
