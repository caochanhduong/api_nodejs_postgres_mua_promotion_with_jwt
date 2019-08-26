'use strict';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 5000,
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken");




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// console.log(port)
app.use(function(req, res, next) {
//   console.log(port)
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

var routes = require('./routes/taskRoutes');
routes(app);

app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port,()=>{
    console.log('Server API game MUA promotion start on port: ' + port);
});



module.exports = app;
