class SuperSixError extends Error {
    constructor(message, httpCode) {
        super(message);
        this.httpCode = httpCode;
    }
}

class ValidationError extends SuperSixError {
    constructor(message, httpCode) {
        super(message || "Validation error", httpCode || "400");
    }
}

class UserNotFoundError extends SuperSixError {
    constructor(message, httpCode) {
        super(message || "Invalid user", httpCode || "404");
    }
}

class InvalidCredentialsError extends SuperSixError {
    constructor(message, httpCode) {
        super(message || "Invalid credentials", httpCode || "401");
    }
}

class UnauthorizedException extends SuperSixError {
    constructor(message, httpCode) {
        super(message || "Unauthorised user", httpCode || "401");
    }
}


module.exports = {
    SuperSixError,
    ValidationError,
    UserNotFoundError,
    InvalidCredentialsError,
    UnauthorizedException
}