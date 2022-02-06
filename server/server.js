require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
console.log(process.env.CLIENT_URL);
const RequestHelper = require("./src/RequestHelper");
const ResponseHelper = require("./src/ResponseHelper");
const Token = new (require("./src/Token"))();
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

// Create a local server to receive data from
let protocol = process.env.ENABLE_SSL === 'true' ? require("https") : require("http");
let options = process.env.ENABLE_SSL === 'true' ? {
  key: fs.readFileSync(path.normalize('./' + process.env.SSL_KEY)),
  cert: fs.readFileSync(path.normalize('./' + process.env.SSL_CERT))
} : {}

const server = protocol.createServer(options);

const routes = require("./routes");
const SQLException = require("./src/exceptions/SQLException");
const InvalidJsonException = require("./src/exceptions/InvalidJsonException");

// Listen to the request event
server.on("request", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.setHeader("Access-Control-Allow-Headers", "Authorization");
  res.setHeader("Access-Control-Allow-Methods", [
    "GET",
    "POST",
    "PUT",
    "DELETE",
  ]);

  const reqHelper = new RequestHelper(req);
  const resHelper = new ResponseHelper(res);

  if ((process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging")) {
    if (req.url.startsWith("/static")) {
      fsPromises.readFile(path.normalize(__dirname + "/public" + req.url)).then(data => {
        res.writeHead(200);
        res.end(data);
      })
    } 

    if (req.url.startsWith("/") && !req.url.startsWith("/static") && !req.url.startsWith("/storage") && !req.url.startsWith("/api")) {
      fsPromises.readFile(path.normalize(__dirname + "/public/index.html")).then(data => {
        res.writeHead(200);
        res.end(data);
      })
    }
  }


  if (req.headers.origin === process.env.CLIENT_URL && req.url.startsWith("/storage")) {
    fs.readFile(__dirname + req.url, function (err, data) {
      if (err) {
        resHelper.responseError(err);
        return;
      }

      res.writeHead(200);
      res.end(data);
    });

    return;
  }

  if ((process.env.SAME_ORIGIN === 'true' || req.headers.origin === process.env.CLIENT_URL) && req.url.startsWith("/api")) {
    req.setEncoding("utf-8");
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];

      if (req.url === route.url) {
        if (req.url !== "/api/auth" && (!reqHelper.authorizationHeaderExists() || !Token.verifyJWT(reqHelper.getRequestToken()))) {
          resHelper.responseInvalidToken();
          break;
        }
        console.log(req.url);
        (async () => {
          try {
            console.log(route);
            const result = await route.action(reqHelper, resHelper);

            if (result instanceof Error) throw result;
          } catch (error) {
            if (error instanceof InvalidJsonException) {
              console.error(error);
              resHelper.responseInvalidJson();
            } else if (error instanceof SQLException) {
              if (error.code === "SQLITE_ERROR") {
                console.error(error);
                resHelper.responseInvalidCrudData();
              } else if (error.code === "SQLITE_CONSTRAINT") {
                console.error(error);
                resHelper.responseRecordAlreadyExists();
              }
            } else {
              if (process.env.APP_ENV === 'production' || process.env.APP_ENV === 'staging') {
                console.error(error);
                resHelper.responseError("Something went wrong");
              } else {
                console.error(error);
                resHelper.responseError(error);
              }
            }
          }
        })();

        break;
      }
    }
  }
});

console.log(`Listening on port: ${process.env.SERVER_PORT || 8080}`);

server.listen(process.env.SERVER_PORT || 8080);
