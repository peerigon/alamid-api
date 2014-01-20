"use strict";

var httpAdapter = require("./httpAdapter.js");

function httpHandler(app) {

    //connect/express
    if(typeof app.use === "function") {
        app.use(httpAdapter);
    }
    //
    else {
        app.on("request", httpAdapter);
    }
}

module.exports = httpHandler;