const RequestHelper = require("../src/RequestHelper");
const ResponseHelper = require("../src/ResponseHelper");
const DBManager = new (require("../src/db/DB"))();
const Token = new (require('../src/Token'))();

module.exports = {
    name: 'read',
    type: 'GET',
    action: (req, res) => {
        (async () => {
            const requestHelper = new RequestHelper(req);
            const responseHelper = new ResponseHelper(res);

            try {
                const requestBody = await requestHelper.getRequestData();

                if (!Token.verifyJWT(requestHelper.getRequestToken())) {
                    responseHelper.responseInvalidToken();
                }

                const conn = DBManager.startConnection();

                const result = await conn.runStatement(`SELECT * FROM ${requestBody.name} WHERE Id = '${requestBody.data.Id}'`);

                responseHelper.responseSuccess(result);
            } catch (error) {
                if (error instanceof SyntaxError) {
                    responseHelper.responseInvalidJson();
                } else if (error instanceof Error && 'code' in error && error.code === "SQLITE_ERROR") {
                    console.error(error);
                    responseHelper.responseInvalidCrudData();
                } else {
                    console.error(error);
                }
            }
        })();
    }
}