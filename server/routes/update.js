const RequestHelper = require("../src/RequestHelper");
const DBManager = new (require("../src/db/DB"))();
const Token = new (require('../src/Token'))();

module.exports = {
    name: 'read',
    type: 'PUT',
    action: (req, res) => {

    }
}