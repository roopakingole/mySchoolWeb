var http = require('http');
var url = require('url');


var emp = require('./employee.js');

var ss = require('mysql');

var port = process.env.port || 1337;


http.createServer(function (req, res) {
     

    //if (req.url === "/employees") {
    //    emp.getList(req, res);
    //}
    //else if (req.url === "/employees/state") {
    //    emp.getStateInfo(req, res);
    //}
    //else if (req.url === "/employees/city") {
        
    //    var ID = url.parse(req.url, true).query.SRC;
    //    emp.getCityInfo(req, res);
    //}

    if (url.parse(req.url).pathname === "/employees/ShowInfo") {
        emp.getList(req, res);
    }
    else if (url.parse(req.url).pathname === "/employees/state") {
        emp.getStateInfo(req, res);
    }
    else if (url.parse(req.url).pathname === "/employees/city") {
        var ID = url.parse(req.url, true).query.SRC;
        emp.getCityInfo(req, res);
    }
    else if (url.parse(req.url).pathname === "/employees/saveinformation") {
        emp.saveinformation(req,res);
    }

    else if (url.parse(req.url).pathname === "/employees/IsUniqueValue") {
        emp.IsUnique(req, res);
    }
    else if (url.parse(req.url).pathname === "/employees/Login") {
        emp.Login(req, res);
    }

    //res.writeHead(200, { 'Content-Type': 'text/plain' });
    //res.end('Hello World\n');
}).listen(port);

