"use strict";

var express = require("express"),
    http = require("http"),
    expressSession = require("express-session"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    api = require("alamid-api");

var app = express(),
    server = http.createServer(app),
    io = require("socket.io")(server);

var session = {
    store: new expressSession.MemoryStore(),
    secret: "secret",
    key: "mykey.sid",
    cookieParser: cookieParser("secret"),
    saveUninitialized: true,
    resave: true
};

app.use(express.static(__dirname + '/static'));

app.use(bodyParser.json());
app.use(session.cookieParser);

app.use(expressSession(session));

//alamid-api plugins
//with connect/express app
api.use(require("alamid-api/plugins/connect"), { app: app });

//with socket.io
api.use(require("alamid-api/plugins/socket.io"), { io: io, session: session });

var hybridRouter = api.router();

//attach some hybrid routes
hybridRouter.get("/hello", function(req, res) {
    res.end("/hello called with " + req.transport + " SESSION: " + JSON.stringify(req.session.hello));
});

hybridRouter.post("/hello", function(req, res) {
    req.session.hello = req.body;
    res.end("/hello " + req.transport + JSON.stringify(req.session));
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