import { FileType } from '../@types/api';
import { readFileAsDataUrl } from './FileReader';

export default class Api {
    private token: string;
    private serverUrl: string;

    constructor(token: string, serverUrl: string | undefined = process.env.REACT_APP_SERVER_URL) {
        this.token = token;
        
        if (serverUrl === undefined) {
            throw Error("ENV Variable not found.")
        }
    
        this.serverUrl = serverUrl + '/api';
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

    async verifyPassword(email: string, password: string) {
        return await this._doFetch(this.serverUrl + `/compare`, 'POST', {
            email: email,
            password: password
        });
    }

    async all(resource: string) {
        return await this._doFetch(this.serverUrl + `/${resource}`, 'GET');
    }

    async create(resource: string, values: Array<string>) {
        return await this._doFetch(this.serverUrl + `/${resource}/create`, 'POST', {
            values: values,
        });
    }

    async createFile(docName: string, fileName: string, dataString: string, type: FileType, companyId: number | null = null, templateId: number | null = null) {
        return await this._doFetch(this.serverUrl + `/${type}/create`, 'POST', {
            docName: docName,
            name: fileName,
            data: dataString,
            companyId: companyId,
            templateId: templateId,
        });
    }

    async updateFile(docName: string, fileName: string, dataString: string, type: FileType, id: number, values: Array<string>, companyId: number | null = null, templateId: number | null = null) {
        return await this._doFetch(this.serverUrl + `/${type}/update`, 'PUT', {
            docName: docName,
            id: id,
            values: values,
            name: fileName,
            data: dataString,
            companyId: companyId,
            templateId: templateId,
        });
    }

    // Can be used for removing any file from the storage
    async removeFile(id: number, type: FileType) {
        return await this._doFetch(this.serverUrl + `/${type}/delete`, 'DELETE', {
            id: id,
        });
    }

    async createImage(file: File, companyId: number | null = null) {
        const result = await readFileAsDataUrl(file);
        return await this.createFile('', file.name, result, "image", companyId);
    }

    async removeImage(id: number) {
        return await this.removeFile(id, "image");
    }

    async read(resource: string, id: number) {
        return await this._doFetch(this.serverUrl + `/${resource}/read`, 'POST', { id: id });
    }

    async update(resource: string, id: number, values: Array<string | null>) {
        return await this._doFetch(this.serverUrl + `/${resource}/update`, 'PUT', {
            id: id,
            values: values,
        });
    }

    async delete(resource: string, id: number) {
        return await this._doFetch(this.serverUrl + `/${resource}/delete`, 'DELETE', { id: id });
    }
}
