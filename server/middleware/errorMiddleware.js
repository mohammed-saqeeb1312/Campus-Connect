
function errorMiddleware(err, req, res, next) {

    // Default status code and error message
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        message = "This record already exists.";
    }

    // Handle invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID provided.";
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((item) => item.message)
            .join(", ");
    }

    // Send consistent error response
    res.status(statusCode).json({
        success: false,
        message
    });
}

module.exports = errorMiddleware;
