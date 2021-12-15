import { readFileAsDataUrl } from './FileReader';
import { getToken } from './Token';

export default class Api {
    constructor(token, serverUrl = process.env.REACT_APP_SERVER_URL) {
        this.token = token;
        this.serverUrl = serverUrl;
    }

    async _doFetch(url, method, body = null) {
        let options;

        if (method === 'GET') {
            options = {
                method: method,
                headers: { Authorization: 'Bear ' + this.token },
            };
        } else {
            options = {
                method: method,
                headers: { Authorization: 'Bear ' + this.token },
                body: JSON.stringify(body),
            };
        }

        return await fetch(url, options)
            .then((res) => res.json())
            .catch((err) => console.error(err));
    }

    async all(resource) {
        return await this._doFetch(this.serverUrl + `/${resource}`, 'GET');
    }

    async create(resource, values) {
        return await this._doFetch(this.serverUrl + `/${resource}/create`, 'POST', {
            values: values,
        });
    }

    async createImage(file, companyId = null) {
        const result = await readFileAsDataUrl(file);
        return await this._doFetch(this.serverUrl + `/image/create`, 'POST', {
            name: file.name,
            image: result,
            companyId: companyId,
        });
    }

    async removeImage(id) {
        return await this._doFetch(this.serverUrl + `/image/delete`, 'DELETE', {
            id: id,
        });
    }

    async read(resource, id) {
        return await this._doFetch(this.serverUrl + `/${resource}/read`, 'POST', { id: id });
    }

    async update(resource, id, values) {
        return await this._doFetch(this.serverUrl + `/${resource}/update`, 'PUT', {
            id: id,
            values: values,
        });
    }

    async delete(resource, id) {
        return await this._doFetch(this.serverUrl + `/${resource}/delete`, 'DELETE', { id: id });
    }
}
