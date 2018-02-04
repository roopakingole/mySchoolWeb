var express = require('express');
var emp = require('./employee.js');
var bus = require('./bus.js');
var ss = require('mysql');


app = express();
port = process.env.PORT || 1337;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/login', function (req, res) {
    console.log('called login');
    emp.login(req,res);
});

app.get('/employees/ShowInfo', function (req, res) {
	console.log('called ShowInfo');
  emp.getList(req, res);
});

app.get('/employees/ShowInfo2', function (req, res) {
	console.log('called ShowInfo2');
  emp.getList2(req, res);
});

app.get('/employees/getCountryList', function (req, res) {
    console.log('called getCountryList');
    emp.getCountryList(req, res);
});

app.post('/employees/saveinformation', function (req, res) {
    console.log('called saveinformation');
    emp.saveinformation(req,res);
});

app.post('/employees/registerStudent', function (req, res) {
    console.log('called registerStudent');
    emp.registerStudent(req,res);
});

app.get('/bus/getRouteList', function (req, res) {
    console.log('called getRouteList');
    bus.getRouteList(req,res);
});
app.get('/bus/getRoute', function (req, res) {
    console.log('called getRoute');
    bus.getRoute(req,res);
});
app.get('/bus/getUserRoute', function (req, res) {
    console.log('called getUserRoute');
    bus.getUserRoute(req,res);
});
app.post('/bus/saveRoute', function (req, res) {
    console.log('called saveRoute');
    bus.saveRoute(req,res);
});
app.get('/about2', function (req, res) {
  res.send('about2')
});


app.listen(port);

console.log('mySchool RESTful API server started on: ' + port);


