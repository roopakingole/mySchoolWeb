var db = require('./db.js');
var url = require('url');

exports.getRoute = function (req, resp) {
    db.getRoute(url.parse(req.url, true).query.SS, function (dd, Error) {
        if (Error) {
            throw Error;
        }
        else {
            resp.writeHead(200, { "Content-type": "application:json" });
            resp.write(JSON.stringify(dd));
            resp.end();
        }
    });
};


exports.getRouteList = function (req, resp) {
    db.getRouteList(url.parse(req.url, true).query.SS, function (dd, Error) {
        if (Error) {
            throw Error;
        }
        else {
            resp.writeHead(200, { "Content-type": "application:json" });
            resp.write(JSON.stringify(dd));
            resp.end();
        }
    });
};

exports.getUserRoute = function (req, resp) {
    db.getUserRoute(url.parse(req.url, true).query.SS, function (dd, Error) {
        if (Error) {
            throw Error;
        }
        else {
            resp.writeHead(200, { "Content-type": "application:json" });
            resp.write(JSON.stringify(dd));
            resp.end();
        }
    });
};

exports.saveRoute = function (req, resp) {
    db.saveRoute(url.parse(req.url, true).query.SS, function (dd, Error) {
        if (Error) {
            throw Error;
        }
        else {
            resp.writeHead(200, { "Content-type": "application:json" });
            resp.write(JSON.stringify(dd));
            resp.end();
        }
    });
};