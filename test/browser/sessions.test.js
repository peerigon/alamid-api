"use strict";

var chai = require("chai"),
    httpRequest = require("browser-request"),
    socketIo = require("socket.io-client"),
    expect = chai.expect,
    when = require("when");

chai.config.includeStack = true;

var socket,
    host = "http://" + location.host;

function request(options) {

    request.transport = options.transport || request.transport || "http";

    if (options.url.indexOf("http") === -1) {
        options.url = host + options.url;
    }

    console.log("Request > " + options.url + " [" + request.transport + "]");

    return when.promise(function (resolve, reject) {

        if (request.transport === "http") {

            if (typeof(options.body) === "object") {
                options.headers = {"content-type": "application/json"};
                options.body = JSON.stringify(options.body);
                options.jar = true; //remember cookies
                options.withCredentials = true;
            }

            httpRequest(options, function (err, response, body) {
                if (err) {
                    reject(err);
                    return;
                }

                if (typeof body !== "object") {
                    body = JSON.parse(body);
                }

                resolve(body);
            });
        }
        else if (request.transport === "ws") {
            socket.emit("request", options, function (res) {
                if (typeof res !== "object") {
                    res = JSON.parse(res);
                }
                resolve(res);
            });
        }
        else {
            reject(new Error("Invalid transport '" + request.transport + "'"));
        }
    });
}

describe("session support", function () {

    //initialize session
    before(function (done) {
        request.type = "http";

        request({
            url: "/test",
            method: "get"
        }).done(function () {
                done();
            },
            done);
    });


    before(function (done) {
       socket = socketIo().on("connect", done);
    });

    describe("#http", function () {

        it("should be able to save and read value from/to the session", function (done) {

            request.transport = "http";

            request({
                url: "/test/?test=http1",
                method: "get"
            })
                .then(function() {
                    return request({
                        url: "/test",
                        method: "get"
                    });
                })
                .then(function (body) {
                    expect(body.data.session).to.eql("http1");

                    return request({
                        url: "/test/?test=http2",
                        method: "get"
                    });
                })
                .then(function() {
                    return request({
                        url: "/test/",
                        method: "get"
                    });
                })
                .then(function (body) {
                    expect(body.data.session).to.eql("http2");
                    done();
                })
                .catch(done);
        });

    });

    describe("#ws", function () {

        it("should be able to save and read value from/to the session", function (done) {

            request.transport = "ws";

            request({
                url: "/test/?test=ws1",
                method: "get"
            })
                .then(function() {
                    return request({
                        url: "/test",
                        method: "get"
                    });
                })
                .then(function (body) {
                    expect(body.data.session).to.eql("ws1");

                    return request({
                        url: "/test/?test=ws2",
                        method: "get"
                    });
                })
                .then(function() {
                    return request({
                        url: "/test/",
                        method: "get"
                    });
                })
                .then(function (body) {
                    expect(body.data.session).to.eql("ws2");
                    done();
                })
                .catch(done);
        });
    });

    describe("#mixed ws/http", function () {

        it("should be able to save and read value from/to the session via http and ws", function (done) {


            request({
                url: "/test/?test=viaHttp",
                method: "get",
                transport: "http"
            })
                .then(function() {
                    return request({
                        transport: "ws",
                        url: "/test",
                        method: "get"
                    });
                })
                .then(function (body) {
                    expect(body.data.session).to.eql("viaHttp");

                    return request({
                        transport: "ws",
                        url: "/test/?test=viaWs",
                        method: "get"
                    });
                })
                .then(function() {
                    return request({
                        transport: "http",
                        url: "/test/",
                        method: "get"
                    });
                })
                .then(function (body) {
                    expect(body.data.session).to.eql("viaWs");
                    done();
                })
                .catch(done);
        });
    });
});