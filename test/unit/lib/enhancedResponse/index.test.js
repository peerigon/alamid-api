"use strict";

var chai = require("chai"),
    expect = chai.expect,
    http = require("http");

chai.use(require("chai-spies"));

chai.config.includeStack = true;

var enhancedResponse = require("../../../../plugins/enhancedResponse/");

enhancedResponse();

describe("enhancedResponse()", function () {
    var req,
        res;

    beforeEach(function () {
        req = new http.IncomingMessage({});
        res = new http.ServerResponse(req);
    });

    describe(".send()", function () {
        var response;

        beforeEach(function () {
            response = {
                status: "success",
                data: {
                    bla: "blub"
                }
            };

            res.end = chai.spy(function () {

            });
        });

        describe("response", function () {

            it("should stringify if response is an object", function () {
                res.send(200, response);

                expect(res.end).to.been.called.with(JSON.stringify(response));
            });

            it("should accept strings as response", function () {
                res.send(200, "bla bla");

                expect(res.end).to.been.called.with("bla bla");
            });
        });

        describe("statusCode", function () {

            it("should set the status code if passed", function () {
                res.send(408, response);

                expect(res.statusCode).to.eql(408);
                expect(res.end).to.been.called.with(JSON.stringify(response));
            });
        });

        describe("(response)", function () {

            it("should accept 'response' if called with one arg", function () {
                res.send(response);

                expect(res.end).to.been.called.with(JSON.stringify(response));
            });
        });

        describe("()", function () {

            it("should use res.status and res.data if called without args", function () {
                res.status = "success";
                res.data = { "bla": "blub" };

                res.send();

                expect(res.end).to.been.called.with(JSON.stringify({
                    status: res.status,
                    data: res.data
                }));
            });

            it("should append res.code if set", function () {
                res.status = "success";
                res.data = { "bla": "blub" };
                res.code = "crazy-error";

                res.send();

                expect(res.end).to.been.called.with(JSON.stringify({
                    status: res.status,
                    data: res.data,
                    code: res.code
                }));
            });

            it("should append res.message if set", function () {
                res.status = "fail";
                res.message = "error message";

                res.send();

                expect(res.end).to.been.called.with(JSON.stringify({
                    status: res.status,
                    data: {},
                    message: res.message,
                }));
            });

            it("should use the defaults if res.status or res.data haven't been set", function () {
                res.send();

                expect(res.end).to.been.called.with(JSON.stringify({
                    status: "success",
                    data: {}
                }));
            });

            it("should determine the string-status if status is numeric", function () {
                res.status = 404;

                res.send();

                expect(res.end).to.been.called.with(JSON.stringify({
                    status: "fail",
                    data: {}
                }));
            });
        });
    });
});