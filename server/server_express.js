var express = require('express');
var emp = require('./employee.js');
var ss = require('mysql');


app = express(),
port = process.env.PORT || 1337;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/employees/ShowInfo', function (req, res) {
	console.log('called ShowInfo');
  emp.getList(req, res);
})

app.get('/about2', function (req, res) {
  res.send('about2')
})


app.listen(port);

console.log('mySchool RESTful API server started on: ' + port);


