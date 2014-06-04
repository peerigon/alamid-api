"use strict";

var connect = require("connect"),
    http = require("http"),
    alamidRequest = require("../lib");

var app = connect(),
    server = http.createServer(app),
    io = require("socket.io")(server);

var session = {
    store: new connect.session.MemoryStore(),
    secret: "secret",
    key: "mykey.sid",
    cookieParser: connect.cookieParser("secret")
};

app.use(connect.json());
app.use(session.cookieParser);
app.use(connect.session(session));
app.use(connect.static(__dirname));

alamidRequest.use(require("../plugins/connect"), { app: app });
alamidRequest.use(require("../plugins/socket.io"), { io: io, session: session, onError: function(err) {
    console.log("err", err);
} });

var router = alamidRequest.router();

router.add(function (req, res) {

    if(req.body.session) {
        req.session.test = req.body.session;
    }

    res.end(JSON.stringify({
        status: "success",
        data: {
            url: req.url,
            body: req.body,
            query: req.query,
            method: req.method,
            transport: req.transport,
            session: req.session.test
        }
    }));
});

server.listen(3000);