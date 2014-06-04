"use strict";

function ioSession(options) {

    var cookieParser = options.cookieParser,
        sessionStore = options.store,
        key = options.key || "connect.sid";

    function findCookie(handshake) {
        return (handshake.secureCookies && handshake.secureCookies[key])
            || (handshake.signedCookies && handshake.signedCookies[key])
            || (handshake.cookies && handshake.cookies[key]);
    }

    function resolve(parseErr, storeErr, session) {
        if (parseErr) return parseErr;
        if (!storeErr && !session) return new Error ("could not look up session by key: " + key);
        return storeErr;
    }

    function getSession(socketHandshake, callback) {
        cookieParser(socketHandshake, {}, function (parseErr) {
            sessionStore.load(findCookie(socketHandshake), function (storeErr, session) {
                var err = resolve(parseErr, storeErr, session);
                callback(err, session);
            });
        });
    }

    return function handleSession(socket, next) {

        getSession(socket.request, function (err, session) {
            if(err) {
                next(err);
                return;
            }

            socket.session = session;
            next();
        });
    };
}

module.exports = ioSession;