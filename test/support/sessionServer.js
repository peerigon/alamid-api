"use strict";

var connect = require("connect"),
    http = require("http"),
    alamidRequest = require("../../lib/index");

var app = connect(),
    server = http.createServer(app),
    io = require("socket.io")(server);

var session = {
    store: new connect.session.MemoryStore(),
    secret: "secret",
    key: "mykey.sid",
    cookieParser: connect.cookieParser("secret")
};

app.use(connect.query());
app.use(connect.json());
app.use(session.cookieParser);

app.use(connect.session(session));
app.use(connect.static(__dirname));

alamidRequest.use(require("../../plugins/connect/index"), { app: app });
alamidRequest.use(require("../../plugins/socket.io/index.js"), { io: io, session: session, onError: function(err) {
    console.log("err", err);
} });

var router = alamidRequest.router();

router.add(function (req, res) {

    if(req.body.session) {
        req.session.test = req.body.session;
    }

    //set if req.query.test is present
    if(req.query && req.query.test) {
        req.session.test = req.query.test;
    }

    res.end(JSON.stringify({
        status: "success",
        data: {
            session: req.session.test
        }
    }));
});

server.listen(parseInt(process.env.PORT));