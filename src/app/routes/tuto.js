const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Tuto = require('../models/tuto.js');
const USERS=require ('../models/user.js');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const bcrypt = require("bcryptjs");
const blacklist = require('express-jwt-blacklist');
const randtoken = require('rand-token');
require('dotenv').config();
const saltRounds = 10;

cloudinary.config({

  cloud_name: process.env.CLOUD_NAME,

  api_key: process.env.API_KEY,

  api_secret: process.env.API_SECRET,

});


/*
!! warning:
here const router can be named with another variable's name
but the name is the same than export's name
*/
const router = express.Router();
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true,useFindAndModify:false });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully!');
});

/* 
app.use(jwt({
  secret: 'todo-app-super-shared-secret',
  isRevoked: blacklist.isRevoked
}));
*/
const handleError = (err, res) => {
  
  res
  .status(500)
  //.contentType("text/plain")
  .end("Oops! Something went wrong: "+err);
  
  // res.send(err)
};

const storage = new CloudinaryStorage({

  cloudinary: cloudinary,

  params:async (req, file) => {

      return {

      folder: 'images',       

      public_id: path.parse(file.originalname).name 

  }},

});


const upload=multer({ storage: storage });

/*------------------------AUTHENTIFICATION-------------------------------*/

router.post("/register",verifyToken, async (req, res) => {
  console.log(req.body);
  try {
    const hashedPwd = await bcrypt.hashSync(req.body.password, saltRounds);
    const insertResult = await USERS.create({
      _id:null,
      username: req.body.username,
      password: hashedPwd,
    });
    res.send(insertResult);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured:"+error);
  }
});
router.route('/auth').get((req, res) => {
  USERS.find(req.params.id, {$set:req.body},(err, liste) => {
    if (err)
    console.log(err);
    else
    // console.log("req.params.id");
    res.json(liste);
    
  });
});
router.post('/auth', async function(req, res) {
  /* USERS.findOne({username:req.body.username},(err, liste) => {
    if( req.body.password != 'todo' ||  req.body.username != 'todo') return res.sendStatus(401);
    else
    
    
    
    token = jwt.sign({userID: USERS.id}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
    
    res.send({token});
    
    
  });
  */
  try {
    const user = await  USERS.findOne({ username: req.body.username });
    console.log(user);
    if (user) {
      const cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        //   ..... further code to maintain authentication like jwt or sessions
        //res.send("Auth Successful");
        token = jwt.sign({userID: USERS.id}, process.env.SECRET_KEY, {expiresIn: '2h'});
        
        res.send({token});
        
      } else {
        res.send("Wrong username or password.");
      }
    } else {
      res.send("Wrong username or password.");
    }
  } catch (error) {
    console.log(error);
    // res.status(500).send("Internal Server error Occured");
    res.sendStatus(401)
  }
});
//This code set json code 401 if client didn't send authorisation header => bearer
/*
This code send json raw rather than angular view when you refresh page (browser)
but the issue is resolved by  res.sendFile that send folder view for api paths (server.js)
*/
app.use(expressJwt({secret: process.env.SECRET_KEY}).unless({path: ['/api/auth']}));

/*----------------------------ROUTING-------------------------------------*/

//-------------------tutos-------------------/
router.post(
  "/upload",verifyToken,
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "../../../dist/tuto/assets/"+req.file.originalname);
    
    if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpg" || path.extname(req.file.originalname).toLowerCase() === ".jpeg") {
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
        .end("Only .png,.jpg,.jpeg files are allowed!");
      });
    }
  }
  );
  //get all tutos
  
  router.get('/tutos',verifyToken,function(req, res) {
    Tuto.find(req.params.id, req.body,(err, liste) => {
      if (err)
      console.log(err);
      else
      //console.log(req.params.id);
      res.json(liste);
      
    });
  });
  
  //get details
  
  router.get('/tutos/details/:id',verifyToken,function(req, res)  {
    Tuto.findById(req.params.id,(err, liste) => {
      if (err)
      console.log(err);
      else
      console.log(req.params.id);
      res.json(liste);
      
    });
  });
  
  
  
  //delete
  
  router.delete('/tutos/details/:id',verifyToken,function(req, res, next){
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
  
  router.post('/tutos/add',verifyToken, function(req, res, next) {
    Tuto.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });
  
  
  
  
  // update
  
  router.put('/tutos/details/:id',verifyToken, function(req, res, next) {
    Tuto.findByIdAndUpdate(req.params.id, {$set:req.body}, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });
  
  
  // Check if token exist in header
  function verifyToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null){
      return res.sendStatus(401)
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
      console.log(err)
      if(err){
        return res.sendStatus(403) 
      }
      req.user = user
      next()
    })
  }
  
  

  module.exports = router;
