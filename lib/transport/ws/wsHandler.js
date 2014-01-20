"use strict";

var SessionSockets = require('session.socket.io'),
    wsAdapter = require("./wsAdapter.js"),
    noop = function () {
    };


function wsHandler(io, options) {
    options = options || {};
    var errorHandler = options.onError || noop,
        sockets,
        session;

    if (options.session) {
        session = options.session;
        sockets = new SessionSockets(io, session.store, session.cookieParser, session.key);
        sockets.on("connection", handleSessionSocket);
        return;
    }

    sockets = io.sockets;
    sockets.on("connection", handleSocket);

    function handleSessionSocket(err, socket, session) {
        if (err) {
            errorHandler(err);
            return;
        }

        //attach ws listeners here
        socket.on("request", function (request, callback) {
            //get the latest session state (needed if http/ws in are both in use)
            reloadSession(session, function (err) {
                if (err) {
                    errorHandler(err);
                    return;
                }

                wsAdapter(request, session, callback);
            });
        });
    }
}

function handleSocket(socket) {
    //attach ws listeners here
    socket.on("request", function (request, callback) {
        wsAdapter(request, {}, callback);
    });
}

function reloadSession(session, callback) {
    session.reload(function (err) {
        if (err) {
            callback(err);
            return;
        }

        session = session.req.session;
        callback(null);
    });
}


module.exports = wsHandler;