class RequestHelper
{
    constructor(request)
    {
        this.request = request;
    }

    getRequestToken() {
        return this.request.headers.authorization.split(' ')[1];
    }

    getRequestData() {
        return new Promise((resolve, reject) => {
            let stringData = '';

            this.request.on('data', (chunk) => (stringData += chunk));

            this.request.on('end', () => {
                try {
                    resolve(JSON.parse(stringData));
                } catch (error) {
                    reject(error)
                }
            });
        })
    }
}

module.exports = RequestHelper;