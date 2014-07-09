"use strict";

var http = require("http"),
    express = require("express"),
    socketIo = require("socket.io"),
    api = require("alamid-api");

var app = express(),
    server = http.createServer(app),
    io = socketIo(server);

app.use(express.static(__dirname + '/static'));

//http only routes
app.get("/hello/http", function(req, res) {
    res.end("You can call me only via http!");
});

//alamid-api plugins
//with connect/express app
api.use(require("alamid-api/plugins/connect"), { app: app });

//with socket.io
api.use(require("alamid-api/plugins/socket.io"), { io: io });

var hybridRouter = api.router();

//attach some hybrid routes
hybridRouter.get("/hello", function(req, res) {
    res.end("/hello called with " + req.transport);
});

/**
 * error-handler
 * gets called if next was called with an error
 */
hybridRouter.on("error", function (err, req, res) {
    console.error(err);
    res.end("Error!");
});




//ws events
io.on("connection", function(socket) {

    socket.on("helloWs", function(data, callback) {
        callback("You can call me only via ws!");
    });

});

server.listen(9000, function () {
    console.log("Server listening on port 9000");
});