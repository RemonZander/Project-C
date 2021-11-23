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

    responseError(errorMessage) {
        this.response.writeHead(200);
        this.response.end(JSON.stringify({
            status: "FAIL",
            err: errorMessage,
            content: {}
        }));
    }

    responseInvalidToken()
    {
        this.responseError("Invalid token provided.")
    }

    responseInvalidCrudData() {
        this.responseError("Invalid body provided. Verify if the column names are correct, names are case sensitive.");
    }

    // Incase of constraints
    responseRecordAlreadyExists() {

    }

    responseInvalidJson() {
        this.responseError("Invalid JSON provided.");
    }
}

module.exports = ResponseHelper;