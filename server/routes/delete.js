const RequestHelper = require("../src/RequestHelper");
const ResponseHelper = require("../src/ResponseHelper");
const DBManager = new (require("../src/db/DB"))();
const Token = new (require('../src/Token'))();

module.exports = {
    name: 'delete',
    type: 'DELETE',
    action: (req, res) => {
        (async () => {

        })();
    }
}