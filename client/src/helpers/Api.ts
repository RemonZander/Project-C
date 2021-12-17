import { readFileAsDataUrl } from './FileReader';
import { getToken } from './Token';

export default class Api {
    private token: string;
    private serverUrl: string;

    constructor(token: string, serverUrl: string | undefined = process.env.REACT_APP_SERVER_URL) {
        this.token = token;
        
        if (serverUrl === undefined) {
            throw Error("ENV Variable not found.")
        }
    
        this.serverUrl = serverUrl;
    }

    async _doFetch(url: string, method: string, body: null | object = null) {
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

    async all(resource: string) {
        return await this._doFetch(this.serverUrl + `/${resource}`, 'GET');
    }

    async create(resource: string, values: Array<string>) {
        return await this._doFetch(this.serverUrl + `/${resource}/create`, 'POST', {
            values: values,
        });
    }

    async createImage(file: File, companyId: number | null = null) {
        const result = await readFileAsDataUrl(file);
        return await this._doFetch(this.serverUrl + `/image/create`, 'POST', {
            name: file.name,
            image: result,
            companyId: companyId,
        });
    }

    async removeImage(id: number) {
        return await this._doFetch(this.serverUrl + `/image/delete`, 'DELETE', {
            id: id,
        });
    }

    async read(resource: string, id: number) {
        return await this._doFetch(this.serverUrl + `/${resource}/read`, 'POST', { id: id });
    }

    async update(resource: string, id: number, values: Array<string>) {
        return await this._doFetch(this.serverUrl + `/${resource}/update`, 'PUT', {
            id: id,
            values: values,
        });
    }

    async delete(resource: string, id: number) {
        return await this._doFetch(this.serverUrl + `/${resource}/delete`, 'DELETE', { id: id });
    }
}
