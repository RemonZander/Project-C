class SQLException extends Error {
    constructor(err) {
        super(err.message);
        this.code = err.code;
        this.stack = err.stack;
    }
}

module.exports = SQLException;