const BaseSqlInstance = require("./BaseSqlInstance");
const SQLException = require('../exceptions/SQLException');

class SqliteInstance extends BaseSqlInstance {
  constructor(db) {
    super();
    this.db = db;
  }

  async runStatement(query, values) {
    return new Promise((resolve, reject) => {
      this.db.all(query, values, (err, results) => {
        if (err) reject(new SQLException(err));

        resolve(results);
      });
    });
  }

  runStatements() {
    this.db.serialize(() => {
      for (let i = 0; i < this.preparedStatements.length; i++) {
        const stmt = this.preparedStatements[i];

        this.runStatement(stmt.query, stmt.values);
      }

      this.preparedStatements = [];
    });
  }

  endConnection() {
    this.db.close();
  }
}

module.exports = SqliteInstance;
