const express = require('express')
const app = express();
const bodyParser = require('body-parser');

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const mongoose =require('mongoose');
const path = require('path');
const router = require('./routes/tuto.js');



app.use(express.static(path.join(__dirname, '../../dist/tuto')));
// all paths in router is mounted on /api path 
app.use('/api', router);

// return angular view so angular routing works and it doesn't return json raw
// all paths that weren't /api are redirected
app.get(/^\/(?!api($|\/.*))/,(req, res, next) => {
  res.sendFile(path.join(__dirname, "../../dist/tuto/index.html"));
});

app.use('*', router);

module.exports = app;
