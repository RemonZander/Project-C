class ResponseHelper {
    constructor(res) {
        this.response = res;
    }

    responseSuccess(content = {}) {
        this.response.writeHead(200);
        this.response.end(JSON.stringify({
            status: "SUCCESS",
            err: null,
            content: content
        }));
    }

    responseError(errorMessage, code = 200) {
        this.response.writeHead(code);
        this.response.end(JSON.stringify({
            status: "FAIL",
            err: errorMessage,
            content: {}
        }));
    }

    responseInvalidToken() {
        this.responseError("Invalid token provided.")
    }

    responseInvalidCrudData() {
        this.responseError("Invalid body provided. Verify if the column names are correct, names are case sensitive.");
    }

    responseRecordAlreadyExists() {
        this.responseError("Record already exists in the database, constraint failed.");
    }

    responseInvalidJson() {
        this.responseError("Invalid JSON provided.");
    }
}

module.exports = ResponseHelper;