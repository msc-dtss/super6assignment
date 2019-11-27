const internalCodes = {
    "Unknown": "000",
    "NotAllowed": "001",
    "InvalidCredentials": "002",
    "InvalidField": "003",
    "UserExists": "004",
    "UserDoesNotExist": "005",
}

class SuperSixError extends Error {
    constructor(message, details, httpCode, code) {
        super(message);
        this.code = code || "000";
        this.httpCode = httpCode;
        this.details = details || { errors: [{ message, code }] };
    }
}

class ValidationError extends SuperSixError {
    constructor(message, details, httpCode, internalCode) {
        super(message || "Validation error", details, httpCode || "422", internalCode);
    }
}

class UserNotFoundError extends SuperSixError {
    constructor(message, details, httpCode) {
        super(message || "Invalid user", details, httpCode || "404", internalCodes.UserDoesNotExist);
    }
}

class InvalidCredentialsError extends SuperSixError {
    constructor(message, details, httpCode) {
        super(message || "Invalid credentials", details, httpCode || "401", internalCodes.InvalidCredentials);
    }
}

class UnauthorizedException extends SuperSixError {
    constructor(message, details, httpCode) {
        super(message || "Unauthorised user", details, httpCode || "401", internalCodes.NotAllowed);
    }
}


module.exports = {
    SuperSixError,
    ValidationError,
    UserNotFoundError,
    InvalidCredentialsError,
    UnauthorizedException,
    codes: internalCodes
}