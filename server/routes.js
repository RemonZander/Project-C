const TableStructure = require("./TableStructure");
const Route = new (require("./src/Route"))();
const DBManager = new (require("./src/db/DB"))();
const Token = new (require("./src/Token"))();
const Storage = new (require("./src/Storage"))();
const path = require("path");

const bcrypt = require('bcrypt');
const saltRounds = 10;

Route.add("/auth", async (req, res) => {
  try {
    if ("authorization" in req.request.headers) {
      const token = req.getRequestToken();

      if (Token.verifyJWT(token)) {
        res.responseSuccess({ token: token });
      } else {
        res.responseSuccess({ token: null });
      }
    } else {
      const conn = DBManager.startConnection();

      const data = await req.getRequestData();

      const result = await conn.runStatement(
        "SELECT * FROM user WHERE Email = ?",
        [data.email]
      );

      if (result.length === 0) {
        res.responseSuccess({ token: null });
      } else {
        bcrypt.compare(data.password, result[0].Password).then(async hashResult => {
          if (hashResult) {
            const role = await conn.runStatement(
              "SELECT Name FROM role WHERE Id = ?",
              [result[0].Role_Id]
            );

            const token = Token.createJWT({
              sub: result[0].Id,
              email: result[0].Email,
              naam: result[0].Name,
              company: result[0].Company_Id,
              type: role[0].Name,
            });

            res.responseSuccess({ token: token });
          } else {
            res.responseSuccess({ token: null });

            conn.endConnection();
          }
        }).catch(error => { throw error })
      }
    }
  } catch (error) {
    return error;
  }
});

Route.add("/compare", async (req, res) => {
  try {
    const conn = DBManager.startConnection();

    const data = await req.getRequestData();

    const result = await conn.runStatement(
      "SELECT Password FROM user WHERE Email = ?",
      [data.email]
    );

    bcrypt.compare(data.password, result[0].Password).then(async result => {
      result ? res.responseSuccess({ valid: true }) : res.responseSuccess({ valid: false });

      conn.endConnection();
    })
  } catch (error) {
    return error;
  }
});

// Adds routes based on the existing table structure defined in TableStructure.js
for (let i = 0; i < TableStructure.length; i++) {
  const table = TableStructure[i];

  if (table.name === "user") {
    Route.add(`/${table.name}`, async (req, res) => {
      try {
        const conn = DBManager.startConnection();

        // create special exception to notify if body is missing or empty
        const results = await conn.runStatement(`SELECT * FROM ${table.name}`);

        results.forEach(result => {
          delete result.Password;
        })
        
        res.responseSuccess(results);
      } catch (error) {
        return error;
      }
    });

    Route.add(`/${table.name}/create`, async (req, res) => {
      try {
        const requestBody = await req.getRequestData();

        const conn = DBManager.startConnection();

        const pswIndex = table.columns.indexOf('Password');
        const plainPsw = requestBody.values[pswIndex];

        bcrypt.hash(plainPsw, saltRounds).then(async hash => {
          requestBody.values[pswIndex] = hash;
          await conn.runStatement(
            `
              INSERT INTO ${table.name} (${table.columns.join()})
              VALUES (${requestBody.values.map((val) => "?").join()})`,
            requestBody.values
          );

          res.responseSuccess();
        })

      } catch (error) {
        return error;
      }
    });

    Route.add(`/${table.name}/read`, async (req, res) => {
      try {
        const requestBody = await req.getRequestData();

        const conn = DBManager.startConnection();

        const result = await conn.runStatement(
          `
          SELECT * FROM ${table.name}
          WHERE Id = ?`,
          [requestBody.id]
        );

        delete result[0].Password;

        if (result.length !== 0) {
          res.responseSuccess(result);
        } else {
          res.responseError("No id found in body.");
        }
      } catch (error) {
        return error;
      }
    });

    Route.add(`/${table.name}/update`, async (req, res) => {
      try {
        const requestBody = await req.getRequestData();

        const conn = DBManager.startConnection();

        const columns = [...table.columns];
        const values = requestBody.values;

        const pswIndex = columns.indexOf('Password');
        const plainPsw = requestBody.values[pswIndex];

        if (plainPsw === null) {
          let arr = [];

          columns.splice(pswIndex, 1);
          values.splice(pswIndex, 1);

          for (let i = 0; i < requestBody.values.length; i++) {
            arr.push(`${columns[i]} = '${values[i]}'`);
          }

          const result = await conn.runStatement(
            `
              UPDATE ${table.name} 
              SET ${arr.join()} 
              WHERE Id = ?`,
            [requestBody.id]
          );

          res.responseSuccess(result);
        } else {
          bcrypt.hash(plainPsw, saltRounds).then(async hash => {
            let arr = [];
    
            for (let i = 0; i < requestBody.values.length; i++) {
              if (table.columns[i] === "Password") {
                arr.push(`${table.columns[i]} = '${hash}'`);
                continue;
              }
  
              arr.push(`${table.columns[i]} = '${requestBody.values[i]}'`);
            }
    
            const result = await conn.runStatement(
              `
              UPDATE ${table.name} 
              SET ${arr.join()} 
              WHERE Id = ?`,
              [requestBody.id]
            );
    
            res.responseSuccess(result);
          })
        }


      } catch (error) {
        return error;
      }
    });

    Route.addDelete(table);
    continue;
  }

  // For creating files to the storage
  if (table.name === "image" || table.name === "design" || table.name === "template") {
      Route.add(`/${table.name}/create`, async (req, res) => {
        try {
            const requestBody = await req.getRequestData();
            const payload = req.getPayload();
            const conn = DBManager.startConnection();

            let date = null;
            let result = null;
            let sqlValues = [];

            if (table.name === "image" || table.name === "design") {
                date = new Date().toLocaleDateString('en-US');
            }

            const companyID = requestBody.companyId !== null ? requestBody.companyId : payload.company;

            if (table.name === "image") {
                result = await Storage.addImage(requestBody.name, companyID, requestBody.data);
                sqlValues = [
                    path.normalize(Storage.storagePathRelative + `/${companyID}/images/${requestBody.name}`),
                    date,
                    '0-0-0000',
                    companyID,
                ];
            } else if (table.name === "template") {
                result = await Storage.addTemplate(requestBody.name, companyID, requestBody.data);
                sqlValues = [
                    path.normalize(Storage.storagePathRelative + `/${companyID}/templates/${requestBody.name}.html`),
                    companyID,
                    requestBody.docName,
                ]
            } else {
                result = await Storage.addDesign(requestBody.name, companyID, requestBody.templateId, requestBody.data);
                sqlValues = [
                    path.normalize(Storage.storagePathRelative + `/${companyID}/designs/${requestBody.templateId}/${requestBody.name}.html`),
                    date,
                    '0-0-0000',
                    0,
                    false,
                    requestBody.templateId,
                    requestBody.docName,
                ]
            }

            if (result !== null) {
                throw result;
            }

            await conn.runStatement(`INSERT INTO ${table.name} (${table.columns.join()}) VALUES (${table.columns.map((val) => "?").join()})`, sqlValues);

            res.responseSuccess();
        } catch (error) {
            return error;
        }
    });

    Route.add(`/${table.name}/update`, async (req, res) => {
      try {
        const requestBody = await req.getRequestData();

        const conn = DBManager.startConnection();

        let arr = [];

        for (let i = 0; i < requestBody.values.length; i++) {
          // if requestbody contains a datastring change filepath and change the old file or files with the new ones
          if (table.columns[i] === "Filepath" && requestBody.data !== null) {
            let result = null;

            const companyID = requestBody.companyId;

            if (table.name === "image") {
              result = await Storage.addImage(requestBody.name, companyID, requestBody.data, true);

              arr.push(`${table.columns[i]} = '${requestBody.values[i]}'`);
            } else if (table.name === "template") {
              result = await Storage.addTemplate(requestBody.name, companyID, requestBody.data, true);

              arr.push(`${table.columns[i]} = '${requestBody.values[i]}'`);
            } else {
                result = await Storage.addDesign(requestBody.docName, companyID, requestBody.templateId, requestBody.data, true);

              arr.push(`${table.columns[i]} = '${requestBody.values[i]}'`);
            }

            if (result !== null) {
              throw result;
            }

            arr.push(`${table.columns[i]} = '${requestBody.name}'`);

            continue;
          }

          arr.push(`${table.columns[i]} = '${requestBody.values[i]}'`);
        }

        const result = await conn.runStatement(
          `
          UPDATE ${table.name} 
          SET ${arr.join()} 
          WHERE Id = ?`,
          [requestBody.id]
        );

        res.responseSuccess(result);
      } catch (error) {
        return error;
      }
    });

    Route.add(`/${table.name}/delete`, async (req, res) => {
      try {
        const conn = DBManager.startConnection();

        const requestBody = await req.getRequestData();

        // Directory unlink
        const file = await conn.runStatement(`SELECT Filepath FROM ${table.name} WHERE Id = ?`, [requestBody.id]);

        Storage.removeImage(file[0].Filepath);

        const result = await conn.runStatement(`DELETE FROM ${table.name} WHERE Id = ?`, [requestBody.id]);

        res.responseSuccess(result);
      } catch (error) {
        return error;
      }
    });

    Route.addAll(table);
    Route.addRead(table);

    continue;
  }

  if (table.name === "company") {
    Route.add(`/${table.name}/create`, async (req, res) => {
      try {
        const requestBody = await req.getRequestData();

        const conn = DBManager.startConnection();

        // create special exception to notify if body is missing or empty
        await conn.runStatement(`INSERT INTO ${table.name} (${table.columns.join()}) VALUES (${requestBody.values.map((val) => "?").join()})`,
          requestBody.values
        );

        const companyId = await conn.runStatement(`SELECT Id FROM ${table.name} WHERE Email = ?`, [requestBody.values[2]]);

        Storage.addCompany(companyId[0].Id);

        res.responseSuccess();
      } catch (error) {
        return error;
      }
    });

    Route.add(`/${table.name}/delete`, async (req, res) => {
      try {
        const conn = DBManager.startConnection();

        const requestBody = await req.getRequestData();

        Storage.removeCompany(requestBody.id);

        const result = await conn.runStatement(
          `DELETE FROM ${table.name} WHERE Id = ?`,
          [requestBody.id]
        );

        res.responseSuccess(result);
      } catch (error) {
        return error;
      }
    });

    Route.addAll(table);
    Route.addRead(table);
    Route.addUpdate(table);

    continue;
  }

  Route.addCrud(table);
}

module.exports = Route.urlCollection;
