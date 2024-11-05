const logger = require('./logger');

// manejador de errores de express
const errorHandler = (error, req, res, next) => {
    logger.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message });
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
