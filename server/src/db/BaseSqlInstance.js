class BaseSqlInstance {
    constructor() {
        this.preparedStatements = [];
    }

    createQuery(query, values) {
        this.preparedStatements.push({ query, values });
    }
}

module.exports = BaseSqlInstance;
