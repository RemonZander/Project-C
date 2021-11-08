require('dotenv').config();

const http = require('http');
const DBManager = new (require('./db/DB'))();

// Create a local server to receive data from
const server = http.createServer();

function getDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        let stringData = '';
        let data = {};

        req.on('data', (chunk) => (stringData += chunk));

        req.on('end', () => {
            // stringData.split('&').forEach((item) => {
            //     const splitString = item.split('=');
            //     data[splitString[0]] = decodeURIComponent(splitString[1]);
            // });
            console.log(stringData);
            resolve(JSON.parse(stringData));
        });
    });
}

// Listen to the request event
server.on('request', (req, res) => {
    // We kijken of de request die binnenkomt van localhost:3000 is
    res.setHeader('Access-Control-Allow-Origin', process.env.APP_URL);
    if (req.headers.origin === process.env.APP_URL) {
        req.setEncoding('utf-8');

        if (req.url === '/auth') {
            // Hier doen we dan onze standaard dingen
            getDataFromRequest(req).then((data) => {
                const conn = DBManager.startConnection();
                conn.runStatement('SELECT * FROM user WHERE Email = ? AND Password = ?', [
                    data.email,
                    data.password,
                ]).then((result) => {
                    if (result.length === 0) {
                        // res.writeHead(301, { Location: process.env.APP_URL + '/' });
                        res.writeHead(200);
                        res.end(JSON.stringify({ content: { auth: false } }));
                    } else {
                        // res.writeHead(301, { Location: process.env.APP_URL + '/user-portal' });
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
