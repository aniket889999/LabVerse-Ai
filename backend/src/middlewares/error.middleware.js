export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: `Route not found: ${req.originalUrl}`
    });
};
//# sourceMappingURL=error.middleware.js.map