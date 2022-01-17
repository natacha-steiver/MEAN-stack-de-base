var express = require('express');
var mongoose = require('mongoose');
var Tuto = require('../models/tuto.js');
const USERS=require ('../models/user.js');
const multer = require("multer");
var path = require('path');
var fs = require('fs');
/*
!! warning:
here const router can be named with another variable's name
but the name is the same than export's name
*/
const router = express.Router();
mongoose.connect('mongodb://localhost:27017/tutos_site', { useNewUrlParser: true,useFindAndModify:false });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully!');
});


const handleError = (err, res) => {
  
  res
  .status(500)
  //.contentType("text/plain")
  .end("Oops! Something went wrong: "+err);
  
  // res.send(err)
};

const upload = multer({
  dest: "../../../dist/tuto/assets"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

/*------------------------AUTHENTIFICATION-------------------------------*/
router.route('/auth').get((req, res) => {
  USERS.find(req.params.id, {$set:req.body},(err, liste) => {
    if (err)
    console.log(err);
    else
    // console.log("req.params.id");
    res.json(liste);
    
  });
});
router.post('/auth', function(req, res) {
  USERS.findOne({surname:req.body.surname},(err, liste) => {
    if( req.body.password != 'todo' ||  req.body.username != 'todo') return res.sendStatus(401);
    else
    
    
    
    token = jwt.sign({userID: USERS.id}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
    
    res.send({token});
  });
});
//This code set json code 401 if client didn't send authorisation header => bearer
/*
This code send json raw rather than angular view when you refresh page (browser)
but the issue is resolved by  res.sendFile that send folder view for api paths (server.js)
*/
app.use(expressJwt({secret: 'todo-app-super-shared-secret'}).unless({path: ['/api/auth']}));

/*----------------------------ROUTING-------------------------------------*/

//-------------------tutos-------------------/
router.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "../../../dist/tuto/assets/"+req.file.originalname);
    
    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);
        
        res
        .status(200)
        .contentType("text/plain")
        .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);
        
        res
        .status(403)
        .contentType("text/plain")
        .end("Only .png files are allowed!");
      });
    }
  }
  );
  //get all tutos
  
  router.route('/tutos').get((req, res) => {
    Tuto.find(req.params.id, req.body,(err, liste) => {
      if (err)
      console.log(err);
      else
      //console.log(req.params.id);
      res.json(liste);
      
    });
  });
  
  //get details
  
  router.route('/tutos/details/:id').get((req, res) => {
    Tuto.findById(req.params.id,(err, liste) => {
      if (err)
      console.log(err);
      else
      console.log(req.params.id);
      res.json(liste);
      
    });
  });
  
  
  
  //delete
  
  router.route('/tutos/details/:id').delete((req, res, next) => {
    //!!! findById + deleteOne to not delete several records
    const id=req.params.id;
    Tuto.findById(req.params.id,(err, liste) => {
      if (err)
      console.log(err);
      else
      // console.log(req.params.id);
      Tuto.deleteOne({ _id: id }, function (err,data) {
        if (err) {
          return next(err);
        } else {
          res.status(200).json({
            msg: id
          })
        }
      });
      
    });
  });
  
  
  
  
  //post - add a tuto
  
  router.post('/tutos/add', function(req, res, next) {
    Tuto.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });
  
  
  
  
  // update
  
  router.put('/tutos/details/:id', function(req, res, next) {
    Tuto.findByIdAndUpdate(req.params.id, {$set:req.body}, function (err, post) {
      if (err) return next(err);
      res.json(post);
      
      
      
      
    });
  });
  
  
  module.exports = router;
