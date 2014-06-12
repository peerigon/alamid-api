"use strict";

var chai = require("chai"),
    expect = chai.expect,
    http = require("http");

chai.config.includeStack = true;

var prepareRequest = require("../../../../lib/transport/prepareRequest.js");

describe("prepareRequest()", function () {
    var req;

    beforeEach(function () {
        req = new http.IncomingMessage({});
    });

    describe("#ALL", function () {

        it("should parse the querys string and attach it to req", function () {

            req.method = "POST";
            req.url = "http://localhost:3000/api?band=moderat";

            prepareRequest(req);

            expect(req.query).to.eql({ band: "moderat" });
        });
    });

    describe("#GET", function () {

        it("should set query as body if no body was passed", function () {

            req.method = "GET";
            req.url = "http://localhost:3000/api?band=moderat";
            req.body = {};

            prepareRequest(req);

            expect(req.query).to.eql({ band: "moderat" });
            expect(req.body).to.eql({ band: "moderat" });
        });

        it("should not set query as body if a body was passed", function () {

            req.method = "GET";
            req.url = "http://localhost:3000/api?band=moderat";
            req.body = {
                song: "a new error"
            };

            prepareRequest(req);

            expect(req.query).to.eql({ band: "moderat" });
            expect(req.body).to.eql({ song: "a new error" });
        });
    });
});