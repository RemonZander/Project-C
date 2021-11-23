const TableStructure = require('./TableStructure');
const Route = new (require('./src/Route'))();
const DBManager = new (require("./src/db/DB"))();
const Token = new (require('./src/Token'))();

Route.add('/auth', async (req, res) => {
    try {
        if ('authorization' in req.request.headers) {
            const token = req.getRequestToken();

            if (Token.verifyJWT(token)) {
                res.responseSuccess({ token: token });
            } else {
                res.responseSuccess({ token: null });
            }
        } else {
            const conn = DBManager.startConnection();

            const data = await req.getRequestData();

            const result = await conn.runStatement('SELECT * FROM user WHERE Email = ? AND Password = ?', [
                data.email,
                data.password,
            ]);

            if (result.length === 0) {
                res.responseSuccess({ token: null });
            } else {
                const role = await conn.runStatement('SELECT Name FROM role WHERE Id = ?', [result[0].Role_Id]);

                const token = Token.createJWT({
                    sub: result[0].Id,
                    email: result[0].Email,
                    company: result[0].Company_Id,
                    type: role[0].Name
                });

                res.responseSuccess({ token: token })
            }

            conn.endConnection();
        }
    } catch (error) {
        return error;
    }
});

Route.addCrudFromTableStructure(TableStructure);

module.exports = Route.urlCollection;