require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');

const routesFolder = path.normalize(process.cwd() + "/routes");

// Create a local server to receive data from
const server = http.createServer();

const routes = fs.readdirSync(routesFolder);

// Listen to the request event
server.on('request', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.APP_URL);
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'PUT', 'DELETE']);

    if (req.headers.origin === process.env.APP_URL) {
        req.setEncoding('utf-8');

        const firstPartOfUrl = req.url.split('/')[1];

        for (let i = 0; i < routes.length; i++) {
            const routeFileName = routes[i];

            const routeFileContent = require(path.normalize(routesFolder + '/' + routeFileName));
            if (firstPartOfUrl === routeFileContent.name) {
                routeFileContent.action(req, res);
                break;
            }
        }
    }
    else
    {
        res.writeHead(404);
        res.end();
    }
});

server.listen(8080);
