const RequestHelper = require("../src/RequestHelper");
const DBManager = new (require("../src/db/DB"))();

module.exports = [
    {
        name: 'company',
        type: 'GET',
        action: (req, res) => {
            const requestHelper = new RequestHelper(req);

            
        }
    }
]