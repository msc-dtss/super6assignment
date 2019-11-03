class SuperSixError extends Error {
    constructor(message, httpCode) {
        super(message);
        this.httpCode = httpCode;
    }
}

class SuperSixValidationError extends SuperSixError {
    constructor(message, httpCode) {
        super(message, httpCode || "400");
        this.httpCode = httpCode;
    }
}


module.exports = {
    SuperSixError,
    SuperSixValidationError
}