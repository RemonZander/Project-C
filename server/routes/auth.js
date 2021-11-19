const RequestHelper = require("../src/RequestHelper");
const ResponseHelper = require("../src/ResponseHelper");
const DBManager = new (require("../src/db/DB"))();
const Token = new (require('../src/Token'))();

module.exports = {
    name: 'auth',
    type: 'GET',
    action: (req, res) => {
        const responseHelper = new ResponseHelper(res);
        const requestHelper = new RequestHelper(req);

        if ('authorization' in req.headers) {
            const token = requestHelper.getRequestToken();
            
            if (Token.verifyJWT(token)) {
                responseHelper.responseSuccess({ token: token });
            } else {
                responseHelper.responseSuccess({ token: null });
            }
        } else {
            (async () => {
                try {
                    const conn = DBManager.startConnection();
                    const data = await requestHelper.getRequestData();
                    const result = await conn.runStatement('SELECT * FROM user WHERE Email = ? AND Password = ?', [
                        data.email,
                        data.password,
                    ]);
                    if (result.length === 0) {
                        res.writeHead(200);
                        res.end(responseHelper.responseSuccess({ token: token }));
                    } else {
                        const token = Token.createJWT({
                            sub: result[0].Id,
                            email: result[0].Email,
                            admin: result[0].Role_Id === 1
                        });

                        responseHelper.responseSuccess({ token: token })
                    }

                    conn.endConnection();
                } catch (error) {
                    if (error.name === "SyntaxError") {
                        // No valid json send through request.
                        // Send response with error.
                        responseHelper.responseInvalidJson();
                    }
                }
            })();
        }
    }
}