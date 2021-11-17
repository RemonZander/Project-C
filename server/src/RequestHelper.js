class RequestHelper
{
    constructor(request)
    {
        this.request = request;
    }

    getDataFromRequest() {
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
        });
    }
}

module.exports = RequestHelper;