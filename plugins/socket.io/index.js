"use strict";

var ioSession = require("socket.io-session-middleware"),
    noop = function () {
    };

/**
 * socket.io plugin
 *
 * configuration:
 * - io: socket.io instance
 * - session: session configuration (optional)
 *
 * attaches an event-listener on "request" events
 * if <session> is set, the request gets a reference to it
 *
 * @param alamidRequest
 * @param options
 */
function socketIoPlugin(alamidRequest, options) {
    options = options || {};

    var errorHandler = options.onError || noop,
        io = options.io,
        sockets = io.sockets,
        session;

    if(!io) {
        throw new Error("Missing socket.io instance, Please pass a reference via config");
    }

    if (options.session) {
        session = options.session;
        sockets.use(ioSession(session));
        sockets.use(handleSessionSocket);
        return;
    }

    sockets.use(handleSocket);

    function handleSessionSocket(socket, next) {

        //attach ws listeners here
        socket.on("request", function (request, callback) {

            //get the latest session state (needed if http/ws are both in use)
            reloadSession(socket, function (err) {

                if (err) {
                    errorHandler(err);
                    callback({
                        status: "error",
                        error: "invalid-session"
                    });
                    return;
                }

                alamidRequest.adapters.ws(request, socket.session, function () {
                    socket.session.save();
                    callback.apply(this, arguments);
                });
            });
        });

        next();
    }

    function handleSocket(socket, next) {
        socket.on("request", function (request, callback) {
            alamidRequest.adapters.ws(request, {}, callback);
        });

        next();
    }

    function reloadSession(socket, callback) {

        if(!socket || !socket.session || !socket.session.reload) {
            callback(new Error("Could not reload session"));
            return;
        }

        socket.session.reload(function (err) {
            if (err) {
                callback(err);
                return;
            }

            socket.session = socket.session.req.session;
            callback(null);
        });
    }
}

module.exports = socketIoPlugin;