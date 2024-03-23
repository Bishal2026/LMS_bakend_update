const errorMiddlewares = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "something went worng";
  return res.status(err.statusCode).json({
    success: true,
    message: err.message,
    stack: err.stack,
  });
};

export default errorMiddlewares;
