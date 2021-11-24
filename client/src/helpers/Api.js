export default class Api {
    constructor(token, serverUrl = process.env.REACT_APP_SERVER_URL) {
        this.token = token;
        this.serverUrl = serverUrl;
    }

    async _doFetch(url, method, tableName = "", data = {}) {
        return await fetch(url, {
            method: method, 
            body: method === "GET" || method === "DELETE" ? null : {type: "API", name: tableName, data: data},
            headers: { 'Authorization': 'Bear ' + token }
        })
        .then(res => res.json())
        .catch(err => console.error(err));
    }

    create(tableName, data) {
        return this._doFetch(this.serverUrl + '/create', "POST", tableName, data);
    }

    read(tableName, col, val) {
        return this._doFetch(this.serverUrl + '/read', "GET", tableName, { "Id": id });
    }

    update(tableName, data) {
        if (!"Id" in data) throw Error("Update method needs an id in the body");

        return this._doFetch(this.serverUrl + '/update', "PUT", tableName, data);
    }

    delete(tableName, id) {
        return this._doFetch(this.serverUrl + '/delete', "DELETE", tableName, {"Id": id});
    }
}
