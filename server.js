const express = require("express");
const app = express();
const config = require("./config/default.json");
const https = require("https");
const routes = require("./routes/router.js");
const serverlogger = require("./common/utils/logger/logger")
  .pinoInstance()
  .child({ fileName: "Server.js" });
const loggerMiddleware = require("./loggerMiddleware");
const APIError = require("./common/model/apiError");
const APIResponse = require("./common/model/apiResponse");
const fs = require('fs')


const SERVICE_PORT = config.PORT | process.env.PORT;
const SERVICE_PORTHTTPS = config.PORTHTTPS;

//dbConnect();
app.use(express.json(), function (err, req, res, next) {
  // Handle err
  let errorResponse = new APIResponse(
    "Fail",
    {},
    new APIError(
        req.headers['x-req-id'],
        err.status.toString(),
        err.message, //,
        err.type,
        err.stack
      )
  );
  
  res.status(err.status).send(errorResponse);
});
app.use(loggerMiddleware);

app.use("/api", routes);

// Fallback to this if no request found (Get Error)
app.use((req, res) => {
  res.sendStatus(404);
});

const options = {
    cert: fs.readFileSync('./certificate/certificate.crt', 'utf8'),
    key: fs.readFileSync('./certificate/privateKey.key', 'utf8')
}

// http Request
const server = app.listen(SERVICE_PORT, function () {
  const port = server.address().port;
  console.log("HTTP server started on ", port);
  serverlogger.info("HTTP server started on ", port);
});

//https Request (for secure purpose)
const serverhttps = https
  .createServer(options,app)
  .listen(SERVICE_PORTHTTPS, function () {
    const port = serverhttps.address().port;
    console.log("HTTPS server started on ", port);
    serverlogger.info("HTTPS server started on ", port);
  });

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const closeServer = () => {
  serverlogger.info("closing app");
};

process.on("SIGTERM", closeServer);
process.on("SIGINT", closeServer);

process.on("uncaughtException", (err) => {
  console.log(err, "uncaughtException");
  serverlogger.error(err.stack);
});

process.on("exit", (err) => {
  console.log(err, "exit");
  serverlogger.error(err.stack);
});
