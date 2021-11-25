const DBManager = new (require("../src/db/DB"))();
const Storage = new (require("./Storage"))();
const fs = require('fs');
const path = require('path');

// The param named table is expected to be an object with property name and columns that represent a table in the database
// TODO: Find more elegent way to create a table object
// TODO: Check needs to be made if a query value contains a number. If so dont use qoutes.
class Route {
    constructor() {
        this.urlCollection = [];
        // this.errorMessage = "Input should be a string or an array";
    }

    add(url, cb) {
        this.urlCollection.push({url: url, action: cb});
    }

    addAll(table) {
        this.add(`/${table.name}`, async (req, res) => {
            try {
                const conn = DBManager.startConnection();

                // create special exception to notify if body is missing or empty
                const result = await conn.runStatement(`SELECT * FROM ${table.name}`);

                res.responseSuccess(result);
            } catch (error) {
                return error;
            }
        })
    }

    addCreate(table) {
        this.add(`/${table.name}/create`, async (req, res) => {
            try {
                const requestBody = await req.getRequestData();

                const conn = DBManager.startConnection();

                // create special exception to notify if body is missing or empty
                await conn.runStatement(`
                    INSERT INTO ${table.name} (${table.columns.join()})
                    VALUES (${requestBody.values.map(val => '?').join()})`,
                    requestBody.values
                );

                res.responseSuccess();
            } catch (error) {
                return error;
            }
        })
    }

    addRead(table) {
        this.add(`/${table.name}/read`, async (req, res) => {
            try {
                const requestBody = await req.getRequestData();

                const conn = DBManager.startConnection();

                const result = await conn.runStatement(`
                    SELECT * FROM ${table.name}
                    WHERE Id = ?`,
                    [requestBody.id]
                );

                if (result.length !== 0) {
                    res.responseSuccess(result);
                } else {
                    res.responseError("No id found in body.");
                }

            } catch (error) {
                return error;
            }
        })
    }

    addUpdate(table) {
        this.add(`/${table.name}/update`, async (req, res) => {
            try {
                const requestBody = await req.getRequestData();

                const conn = DBManager.startConnection();

                let arr = [];

                for (let i = 0; i < requestBody.values.length; i++) {
                    arr.push(`${table.columns[i]} = '${requestBody.values[i]}'`)
                }

                const result = await conn.runStatement(`
                    UPDATE ${table.name} 
                    SET ${arr.join()} 
                    WHERE Id = ?`,
                    [requestBody.id]
                );

                res.responseSuccess(result);
            } catch (error) {
                return error;
            }
        })
    }

    addDelete(table) {
        this.add(`/${table.name}/delete`, async (req, res) => {
            try {
                const conn = DBManager.startConnection();

                const requestBody = await req.getRequestData();

                const result = await conn.runStatement(
                    `DELETE FROM ${table.name} WHERE Id = ?`,
                    [requestBody.id]
                );

                res.responseSuccess(result);
            } catch (error) {
                return error;
            }
        })
    }

    addCrud(table, except = []) {
        this.addAll(table);
        this.addCreate(table);
        this.addRead(table);
        this.addUpdate(table);
        this.addDelete(table);
    }

    addCrudFromTableStructure(TableStructure) {
        for (let i = 0; i < TableStructure.length; i++) {
            const table = TableStructure[i];

            if (table.name === "image") {
                this.add(`/${table.name}/create`, async (req, res) => {
                    try {
                        const requestBody = await req.getRequestData();
                        const payload = req.getPayload();

                        const conn = DBManager.startConnection();

                        const pathToFile = `/${payload.company}/images/${requestBody.name}`;

                        // create special exception to notify if body is missing or empty
                        const date = new Date().toLocaleDateString();

                        fs.appendFile(path.normalize(Storage.storagePath + pathToFile), Buffer.from(requestBody.image.split(',')[1], 'base64'), (err) => {
                            if (err) throw err;
                        });

                        await conn.runStatement(`
                            INSERT INTO ${table.name} (${table.columns.join()})
                            VALUES (${table.columns.map(val => '?').join()})`,
                            [pathToFile, date, date, payload.company]
                        );

                        res.responseSuccess();
                    } catch (error) {
                        return error;
                    }
                });

                this.addAll(table);
                this.addRead(table);
                this.addUpdate(table);
                this.addDelete(table);

                continue
            }

            if (table.name === "company") {
                this.add(`/${table.name}/create`, async (req, res) => {
                    try {
                        const requestBody = await req.getRequestData();

                        const conn = DBManager.startConnection();

                        // create special exception to notify if body is missing or empty
                        await conn.runStatement(`
                            INSERT INTO ${table.name} (${table.columns.join()})
                            VALUES (${requestBody.values.map(val => '?').join()})`,
                            requestBody.values
                        );

                        const companyId = await conn.runStatement(`
                            SELECT Id FROM ${table.name} WHERE Email = ?
                        `, [requestBody.values[2]])

                        Storage.addCompany(companyId[0].Id);

                        res.responseSuccess();
                    } catch (error) {
                        return error;
                    }
                });

                this.addAll(table);
                this.addRead(table);
                this.addUpdate(table);
                this.addDelete(table);

                continue
            }

            this.addCrud(table);
        }
    }
}

module.exports = Route;