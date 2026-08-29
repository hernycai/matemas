class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(msg) {
        return new ApiError(400, msg);
    }

    static unauthorized(msg = 'No autorizado') {
        return new ApiError(401, msg);
    }

    static notFound(msg = 'Recurso no encontrado') {
        return new ApiError(404, msg);
    }
}

export default ApiError;
