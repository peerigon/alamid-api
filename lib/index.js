"use strict";

var router = require("./router.js");

exports.adapters = {
    http: require("./transport/http/httpAdapter.js"),
    ws: require("./transport/ws/wsAdapter.js")
};

exports.router = function() {
    return router;
};

exports.use = function (plugin, config) {
    this._plugins = this._plugins || [];

    if (this._plugins.indexOf(plugin) === -1) {
        plugin(this, config);
        this._plugins.push(plugin);
    }

    return this;
};
