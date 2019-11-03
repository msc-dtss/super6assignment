class SuperSixError extends Error {
    constructor(message, httpCode) {
        super(message);
        this.httpCode = httpCode;
    }
}

class ValidationError extends SuperSixError {
    constructor(message, httpCode) {
        super(message || "Validation error", httpCode || "400");
        this.httpCode = httpCode;
    }
}

class UserNotFoundError extends SuperSixError {
    constructor(message, httpCode) {
        super(message || "Invalid user", httpCode || "404");
        this.httpCode = httpCode;
    }
}


module.exports = {
    SuperSixError,
    ValidationError,
    UserNotFoundError
}