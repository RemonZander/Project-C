const RequestHelper = require("../src/RequestHelper");
const DBManager = new (require("../src/db/DB"))();
const Token = new (require('../src/Token'))();

module.exports = {
    name: 'auth',
    type: 'GET',
    action: (req, res) => {
        if ('authorization' in req.headers) {
            const token = req.headers.authorization.split(' ')[1];
            
            if (Token.verifyJWT(token)) {
                res.writeHead(200);
                res.end(
                    JSON.stringify({
                        content: { token: token },
                    })
                );
            } else {
                res.writeHead(200);
                res.end(JSON.stringify({ content: { token: null } }));
            }
        } else {
            const requestHelper = new RequestHelper(req);
    
            requestHelper.getDataFromRequest()
            .then(data => {
                const conn = DBManager.startConnection();
                conn.runStatement('SELECT * FROM user WHERE Email = ? AND Password = ?', [
                    data.email,
                    data.password,
                ]).then((result) => {
                    if (result.length === 0) {
                        res.writeHead(200);
                        res.end(JSON.stringify({ content: { token: null } }));
                    } else {
                        const token = Token.createJWT({
                            sub: result[0].Id,
                            email: result[0].Email,
                            admin: result[0].Role_Id === 1
                        });
                        
                        res.writeHead(200);
                        res.end(
                            JSON.stringify({
                                content: { token: token },
                            })
                        );
                    }
                });
                conn.endConnection();
            })
            .catch(err => {
                if (err.name === "SyntaxError") {
                    // No valid json send through request.
                    // Send response with error.
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        content: { err: "No valid json body send." },
                    }))
                }
            });
        }
    }
}