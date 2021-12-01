const DBManager = new (require("../src/db/DB"))();
const Storage = new (require("./Storage"))();

class Route {
  constructor() {
    this.urlCollection = [];
  }

  add(url, cb) {
    this.urlCollection.push({ url: url, action: cb });
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
    });
  }

  addCreate(table) {
    this.add(`/${table.name}/create`, async (req, res) => {
      try {
        const requestBody = await req.getRequestData();

        const conn = DBManager.startConnection();

        // create special exception to notify if body is missing or empty
        await conn.runStatement(
          `
                    INSERT INTO ${table.name} (${table.columns.join()})
                    VALUES (${requestBody.values.map((val) => "?").join()})`,
          requestBody.values
        );

        res.responseSuccess();
      } catch (error) {
        return error;
      }
    });
  }

  addRead(table) {
    this.add(`/${table.name}/read`, async (req, res) => {
      try {
        const requestBody = await req.getRequestData();

        const conn = DBManager.startConnection();

        const result = await conn.runStatement(
          `
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
    });
  }

  addUpdate(table) {
    this.add(`/${table.name}/update`, async (req, res) => {
      try {
        const requestBody = await req.getRequestData();

        const conn = DBManager.startConnection();

        let arr = [];

        for (let i = 0; i < requestBody.values.length; i++) {
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
    });
  }

  addCrud(table, except = []) {
    this.addAll(table);
    this.addCreate(table);
    this.addRead(table);
    this.addUpdate(table);
    this.addDelete(table);
  }
}

module.exports = Route;
