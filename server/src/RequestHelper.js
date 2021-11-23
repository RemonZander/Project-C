class RequestHelper
{
    constructor(request)
    {
        this.request = request;
    }

    authorizationHeaderExists() {
        return 'authorization' in this.request.headers;
    }

    getRequestToken() {
        return this.request.headers.authorization.split(' ')[1];
    }

    getPayload = () => {
        return JSON.parse(Buffer.from(this.getRequestToken().split('.')[1], 'base64').toString());
    }

    getRequestData() {
        return new Promise((resolve, reject) => {
            let stringData = '';

            this.request.on('data', (chunk) => (stringData += chunk));

            this.request.on('end', () => {
                try {
                    stringData === '' ? resolve({}) : resolve(JSON.parse(stringData));
                } catch (error) {
                    reject(error)
                }
            });
        })
    }
}

module.exports = RequestHelper;