const DBManager = new (require('./db').DBManager)();

module.exports = {
    exampleAddRole: () => {
        DBManager.startConnection().setDB('kyndadatabase').insertInto('role', ['Name'], ['admin']).endConnection();
    },
};
