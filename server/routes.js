const TableStructure = require("./TableStructure");
const Route = new (require("./src/Route"))();
const DBManager = new (require("./src/db/DB"))();
const Token = new (require("./src/Token"))();
const Storage = new (require("./src/Storage"))();
const path = require("path");

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
        "SELECT * FROM user WHERE Email = ? AND Password = ?",
        [data.email, data.password]
      );

      if (result.length === 0) {
        res.responseSuccess({ token: null });
      } else {
        const role = await conn.runStatement(
          "SELECT Name FROM role WHERE Id = ?",
          [result[0].Role_Id]
        );

        const token = Token.createJWT({
          sub: result[0].Id,
          email: result[0].Email,
          company: result[0].Company_Id,
          type: role[0].Name,
        });

        res.responseSuccess({ token: token });
      }

      conn.endConnection();
    }
  } catch (error) {
    return error;
  }
});

// Adds routes based on the existing table structure defined in TableStructure.js

for (let i = 0; i < TableStructure.length; i++) {
  const table = TableStructure[i];

  if (table.name === "image") {
    Route.add(`/${table.name}/create`, async (req, res) => {
      try {
        const requestBody = await req.getRequestData();
        const payload = req.getPayload();

        const conn = DBManager.startConnection();

        // create special exception to notify if body is missing or empty
        const date = new Date().toLocaleDateString();

        Storage.addImage(requestBody.name, payload.company, requestBody.image);

        await conn.runStatement(
          `
                            INSERT INTO ${table.name} (${table.columns.join()})
                            VALUES (${table.columns.map((val) => "?").join()})`,
          [
            path.normalize(
              Storage.storagePathRelative +
                `/${payload.company}/images/${requestBody.name}`
            ),
            date,
            date,
            payload.company,
          ]
        );

        res.responseSuccess();
      } catch (error) {
        return error;
      }
    });

    Route.add(`/${table.name}/delete`, async (req, res) => {
      try {
        const conn = DBManager.startConnection();

        const requestBody = await req.getRequestData();

        // Directory unlink
        const file = await conn.runStatement(
          `
                    SELECT Filepath FROM ${table.name} WHERE Id = ?`,
          [requestBody.id]
        );

        const filePath = file[0].Filepath;
        const newFilePath = filePath.substring(8);

        Storage.removeImage(Storage.storagePathAbsolute + newFilePath);

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

  if (table.name === "company") {
    Route.add(`/${table.name}/create`, async (req, res) => {
      try {
        const requestBody = await req.getRequestData();

        const conn = DBManager.startConnection();

        // create special exception to notify if body is missing or empty
        await conn.runStatement(
          `
                            INSERT INTO ${table.name} (${table.columns.join()})
                            VALUES (${requestBody.values
                              .map((val) => "?")
                              .join()})`,
          requestBody.values
        );

        const companyId = await conn.runStatement(
          `
                            SELECT Id FROM ${table.name} WHERE Email = ?
                        `,
          [requestBody.values[2]]
        );

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
