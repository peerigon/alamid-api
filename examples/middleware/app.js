"use strict";

var http = require("http"),
    express = require("express"),
    socketIo = require("socket.io"),
    api = require("alamid-api");

//middleware
var bodyParser = require("body-parser"),
    logger = require("./middleware/logger.js").debug;

var app = express(),
    server = http.createServer(app),
    io = socketIo(server);

app.use(express.static(__dirname + "/static"));

//express body parser for HTTP
//IMPORTANT attach your http-only routes before connect plugin
app.use(bodyParser.json());

//no need for body parsing on WS routes

//alamid-api plugins
//with connect/express app
api.use(require("alamid-api/plugins/connect"), { app: app });

//with socket.io
api.use(require("alamid-api/plugins/socket.io"), { io: io });

var hybridRouter = api.router();

//customized morgan-logger for HTTP & WS
hybridRouter.add(logger());

//attach hybrid route
hybridRouter.post("/hello", function(req, res) {
    res.end("[" + req.transport + "] > " + JSON.stringify(req.body));
});

/**
 * error-handler
 * gets called if next was called with an error
 */
hybridRouter.on("error", function (err, req, res) {
    console.error(err);
    res.end("Error!");
});

server.listen(9000, function () {
    console.log("Server listening on port 9000");
});