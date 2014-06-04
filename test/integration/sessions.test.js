"use strict";

var chai = require("chai"),
    httpRequest = require("request"),
    io = require("socket.io-client"),
    expect = chai.expect;

chai.config.includeStack = true;

var socket;

require("../sessionServer");

function request(options, callback) {
    request.type = request.type || "http";

    if (request.type === "http") {

        if (typeof(options.body) === "object") {
            options.headers = {"content-type": "application/json"};
            options.body =  JSON.stringify(options.body);
        }

        httpRequest(options, function (err, response, body) {
            if(err) {
                callback(err);
                return;
            }

            if (typeof body !== "object") {
                body = JSON.parse(body);
            }

            callback(err, body, response);
        });
    }
    else if (request.type === "ws") {
        socket.emit("request", options, function (res) {
            if (typeof res !== "object") {
                res = JSON.parse(res);
            }
            callback(null, res);
        });
    }
    else {
        callback(new Error("Invalid transport '" + request.type + "'"));
    }
}


describe("session support", function () {

    describe("#ws", function () {

        before(function(done) {
            request.type = "http";
            request({
                url: "http://localhost:3000/test?ye=ha",
                method: "get"
            }, done);
        });

        before(function (done) {
            request.type = "ws";

            socket = io("http://localhost:3000");
            socket.on("connect", done);
        });

        it("session", function(done){
            request({
                method: "GET",
                url: "http://localhost:3000/test?ye=ha"
            }, function(err, res) {
                console.log(arguments);
                done(err);
            });

        });

    });
});