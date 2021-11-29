import { readFileAsDataUrl } from './FileReader';
import { getToken } from './Token';

export default class Api {
    constructor(serverUrl = process.env.REACT_APP_SERVER_URL) {
        this.token = getToken();
        this.serverUrl = serverUrl;
    }

    async _doFetch(url, method, body) {
        return await fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: { Authorization: 'Bear ' + this.token },
        })
            .then((res) => res.json())
            .catch((err) => console.error(err));
    }

    async all(tableName) {
        return await this._doFetch(this.serverUrl + `/${tableName}`, 'GET', {});
    }

    async create(tableName, values) {
        return await this._doFetch(this.serverUrl + `/${tableName}/create`, 'POST', {
            values: values,
        });
    }

    async createImage(file) {
        const result = await readFileAsDataUrl(file);

        return await this._doFetch(this.serverUrl + `/image/create`, 'POST', {
            name: file.name,
            image: result,
        });
    }

    async read(tableName, id) {
        return await this._doFetch(this.serverUrl + `/${tableName}/read`, 'GET', { id: id });
    }

    async update(tableName, id, values) {
        return await this._doFetch(this.serverUrl + `/${tableName}/update`, 'PUT', {
            id: id,
            values: values,
        });
    }

    async delete(tableName, id) {
        return await this._doFetch(this.serverUrl + `/${tableName}/delete`, 'DELETE', { id: id });
    }
}
