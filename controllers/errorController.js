const AppError = require('../utils/AppError');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  };
  const sendErrorProd = (err, res) => {
    // Operational, to the client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } // Programming or other unknown error: doesn't have to be leaked
    else {
      //1) Log error
      console.error('ERROR 🤯', err);
      //2) Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  };
  
  const handleCastErrorDb = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  };
  
  const handleDuplicateErrorDb = err => {
    // const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    // console.log(value);
  
    const message = `Duplicate field ${err.message}`;
    return new AppError(message, 400);
  };
  
  const handleJWTError = () =>
    new AppError('Invalid token. Please login again!', 401);
  
  const handleJWTExpired = () =>
    new AppError('Your token has expired. Please login again', 401);
  
  ///
  ///
  
  module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      if (err.name === 'CastError') error = handleCastErrorDb(err);
      if (err.name === 'MongoError') error = handleDuplicateErrorDb(err);
      if (err.name === 'JsonWebTokenError') error = handleJWTError(err);
      if (err.name === 'TokenExpiredError') error = handleJWTExpired(err);
  
      sendErrorProd(error, res);
    }
  };
  