"use strict";

var connect = require("connect"),
    http = require("http"),
    alamidRequest = require("../lib");

var app = connect(),
    server = http.createServer(app),
    io = require("socket.io")(server);

app.use(connect.json());

alamidRequest.use(require("../plugins/connect"), { app: app });
alamidRequest.use(require("../plugins/socket.io"), { io: io });

var router = alamidRequest.router();

router.add(function (req, res) {

    res.end(JSON.stringify({
        status: "success",
        data: {
            url: req.url,
            body: req.body,
            query: req.query,
            method: req.method,
            transport: req.transport
        }
    }));
});

server.listen(3000);