require("dotenv").config();

const http = require("http");
const RequestHelper = require("./src/RequestHelper");
const ResponseHelper = require("./src/ResponseHelper");
const Token = new (require("./src/Token"))();
const fs = require("fs");

// Create a local server to receive data from
const server = http.createServer();

const routes = require("./routes");
const SQLException = require("./src/exceptions/SQLException");
const InvalidJsonException = require("./src/exceptions/InvalidJsonException");

// Listen to the request event
server.on("request", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.APP_URL);
  res.setHeader("Access-Control-Allow-Headers", "Authorization");
  res.setHeader("Access-Control-Allow-Methods", [
    "GET",
    "POST",
    "PUT",
    "DELETE",
  ]);

  const reqHelper = new RequestHelper(req);
  const resHelper = new ResponseHelper(res);

  if (req.url.startsWith("/storage")) {
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

  if (req.headers.origin === process.env.APP_URL) {
    req.setEncoding("utf-8");
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];

      if (req.url === route.url) {
        if (req.url !== "/auth" && (!reqHelper.authorizationHeaderExists() || !Token.verifyJWT(reqHelper.getRequestToken()))) {
          resHelper.responseInvalidToken();
          break;
        }

        (async () => {
          try {
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
              console.error(error);
              resHelper.responseError();
            }
          }
        })();

        break;
      }
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(8080);
