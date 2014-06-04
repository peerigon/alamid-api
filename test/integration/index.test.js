"use strict";

var chai = require("chai"),
    httpRequest = require("request"),
    io = require("socket.io-client"),
    expect = chai.expect;

chai.config.includeStack = true;

var socket;

require("../server");

function request(options, callback) {
    request.type = request.type || "http";

    if (request.type === "http") {

        if (typeof(options.body) === "object") {
            options.headers = {"content-type": "application/json"};
            options.body =  JSON.stringify(options.body);
        }

        httpRequest(options, function (err, response, body) {
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

function runTests() {

    it("should accept requests", function validateBasicRequest(done) {
        request({
            method: "POST",
            url: "http://localhost:3000/test",
            body: { da: "ta" }
        }, function (err, res) {
            expect(err).to.eql(null);
            expect(res.data.url).to.eql("/test");
            expect(res.data.body).to.eql({ da: "ta" });
            expect(res.data.method).to.eql("POST");
            expect(res.data.transport).to.eql(request.type);
            done();
        });
    });

    it("should parse the query string", function (done) {
        request({
            method: "POST",
            url: "http://localhost:3000/test?ye=ha"
        }, function (err, res) {
            expect(err).to.eql(null);
            expect(res.data.url).to.eql("/test?ye=ha");
            expect(res.data.body).to.eql({});
            expect(res.data.query).to.eql({ ye: "ha" });
            expect(res.data.method).to.eql("POST");
            expect(res.data.transport).to.eql(request.type);
            done();
        });
    });

    it("should overwrite body with query on GET if no data was passed", function (done) {
        request({
            method: "GET",
            url: "http://localhost:3000/test?ye=ha"
        }, function (err, res) {
            expect(err).to.eql(null);
            expect(res.data.url).to.eql("/test?ye=ha");
            expect(res.data.body).to.eql({ ye: "ha" });
            expect(res.data.query).to.eql({ ye: "ha" });
            expect(res.data.method).to.eql("GET");
            expect(res.data.transport).to.eql(request.type);
            done();
        });
    });

    //won't be able to send body on HTTP, but only on WS
    if (request.type === "ws") {
        it("should not overwrite body with query if body exists on GET", function (done) {
            request({
                method: "GET",
                url: "http://localhost:3000/test?ye=ha",
                body: {
                    yi: "hu"
                }
            }, function (err, res) {
                expect(err).to.eql(null);
                expect(res.data.url).to.eql("/test?ye=ha");
                expect(res.data.body).to.eql({ yi: "hu" });
                expect(res.data.query).to.eql({ ye: "ha" });
                expect(res.data.method).to.eql("GET");
                expect(res.data.transport).to.eql(request.type);
                done();
            });
        });
    }
}

describe("request", function () {

    describe("#http", function () {

        before(function () {
            request.type = "http";
        });

        runTests();
    });

    describe("#ws", function () {

        before(function (done) {
            request.type = "ws";

            socket = io("ws://localhost:3000");
            socket.on("connect", done);
        });

        runTests();
    });
});