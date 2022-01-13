class InvalidJsonException extends SyntaxError {
    constructor(err) {
        super(err.message);
    }
}

module.exports = InvalidJsonException;