require('dotenv').config();

const http = require('http');
const DBManager = new (require('./db/DB'))();

// Create a local server to receive data from
const server = http.createServer();

function getDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        let stringData = '';

        req.on('data', (chunk) => (stringData += chunk));

        req.on('end', () => {
            resolve(JSON.parse(stringData));
        });
    });
}

// Listen to the request event
server.on('request', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.APP_URL);

    if (req.headers.origin === process.env.APP_URL) {
        req.setEncoding('utf-8');

        if (req.url === '/auth') {
            getDataFromRequest(req).then((data) => {
                const conn = DBManager.startConnection();
                conn.runStatement('SELECT * FROM user WHERE Email = ? AND Password = ?', [
                    data.email,
                    data.password,
                ]).then((result) => {
                    if (result.length === 0) {
                        res.writeHead(200);
                        res.end(JSON.stringify({ content: { auth: false } }));
                    } else {
                        res.writeHead(200);
                        res.end(
                            JSON.stringify({
                                content: { auth: true, isAdmin: result[0].Role_Id === 1 },
                            })
                        );
                    }
                });

                conn.endConnection();
            });
        }
    }
});

server.listen(8080);
