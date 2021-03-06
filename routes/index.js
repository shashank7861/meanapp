var express = require('express');
var router = express.Router();
var assert = require('assert');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require("multer");
var upload =multer({dest: "../public/uploads"});
mongoose.connect('localhost:27017/proj')
var conn = mongoose.connection;
var passport = require('passport');

//mongoose.connect('mongodb://admin:admin@ds137090.mlab.com:37090/mymeandb')
var Schema=mongoose.Schema;
var session;
var msg;

//Database Models
var User= require('../models/user');
var Profile= require('../models/profile');

var postDataSchema=new Schema({
    title:{type:String,require:true},
    data:{type:String,require:true},
    createdAt:{type:Date,default:Date.now},
    author:String,
    published:{type:Boolean,default:false}
},{collection:'postdata'});

var Post=mongoose.model('postdata',postDataSchema);

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, req.session.user._id );
  }
});

var upload = multer({ storage : storage}).single('pic');

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect: '/',
    failureRedirect: '/login' }));

router.post('/fileupload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
          console.log("Error uploading file.");
          msg='Error in uploading file';
          res.render('system/fileupload',{title: 'File Upload',msg:msg,session:req.session.user,layout: 'dash.hbs'});
        }
        else{
          console.log("File Uploaded");
          msg='File uploaded';
          res.render('system/fileupload',{title: 'File Upload',session:req.session.user,msg:msg,layout: 'dash.hbs'});
        }
    });
});

router.post('/insert',function (req,res,next){
  var user={
    name:req.body.name,
    email:req.body.email,
    contact:req.body.contact,
    passwd:req.body.passwd,
  };
  var email=user.email;
  console.log(user.email);
  User.findOne({email:email},function(err,userexist){
      if(err){
        console.log(err);
      }
      if(!userexist){
        console.log("No User Found");
        var data=new User(user);
        data.save();
        res.render('signin',{title: 'Log In',msg:'Sign Up successfull please Sign in to continue...' ,layout: 'layout.hbs'});
      }
      else{
        console.log("User already registered");
        res.render('signup',{title: 'SignUp',msg:'Email is already in use!!!' ,layout: 'layout.hbs'});
      }
    })
});

router.post('/create-post',function (req,res,next){
  var post={
    title:req.body.title,
    data:req.body.data,
    author:req.body.author
    };
    var data=new Post(post);
    if(data.save()){
      console.error('Created');
    }
    Post.find()
    .then(function(doc){
    res.render('system/posts',{title: 'Posts',session:req.session.user,post:doc,layout: 'dash.hbs'});
  });
});

router.post('/create-profile/:userid',function (req,res,next){
  var userid=req.params.userid;
  var profile={
    address:req.body.address,
    city:req.body.city,
    state:req.body.state,
    country:req.body.country,
    pin:req.body.pin,
    user:userid
    };
    console.log(profile);
    Profile.findOne({'user': userid}, function(err,data){
    if(data){
      console.log('profile already exists');
      data.address=req.body.address;
      data.city=req.body.city;
      data.state=req.body.state;
      data.country=req.body.country;
      data.pin=req.body.pin;
      data.save();
      console.log('Profile Updated');
    }
    else{
      console.log(profile);
      var data=new Profile(profile);
      if(data.save()){
        console.error('Created');
      }
    }
    });
    res.redirect('/userprofile');
});

router.post('/fn_login',function(req,res){
    var email=req.body.email;
    var passwd=req.body.passwd;
    User.findOne({email:email,passwd:passwd},function(err,user){
      if(err){
        console.log(err);
      }
      if(!user){
        console.log("No User Found");
        msg = 'Incorrect username or password';
        res.redirect('/signin');
      }
      else{
        req.session.user=user;
        console.log(req.session.user);
        res.redirect('/dashboard');
        console.log("go");
      }
    })
})

router.get('/pic', function(req, res, next) {
  return './uploads';
});

router.get('/', function(req, res, next) {
  Post.find()
  .then(function(doc){
  res.render('index',{ title: 'Home' ,layout: 'layout.hbs',post:doc});
});

router.get('/vehicle', function(req, res, next) {
  if(!req.session.user)
  {
    res.render('signin',{title: 'Log In',msg:'Please Sign in to continue...' ,layout: 'layout.hbs'});
  }
  else
  {
    Post.find()
    .then(function(doc){
    res.render('users/vehicle',{title: 'Vehicles',session:req.session.user,post:doc,layout: 'dash.hbs'});
  })
}
});
});

router.get('/post-image', function(req, res, next) {
  Post.find()
  .then(function(doc){
  res.render('system/upload-image',{ title: 'Post' ,layout: 'dash.hbs',post:doc});
});
});

router.get('/fileupload', function(req, res, next) {
  res.render('system/fileupload',{title: 'File Upload',session:req.session.user,layout: 'dash.hbs'});
});

router.get('/c_db', function(req, res, next) {
  Post.find()
    .then(function(doc){
    res.render('dbdata',{title: 'DataBase',session:req.session.user,post:doc,layout: 'layout.hbs'});
  })
});

router.get('/posts', function(req, res, next) {
  if(!req.session.user)
  {
    res.render('signin',{title: 'Log In',msg:'Please Sign in to continue...' ,layout: 'layout.hbs'});
  }
  else
  {
    Post.find()
    .then(function(doc){
    res.render('system/posts',{title: 'Posts',session:req.session.user,post:doc,layout: 'dash.hbs'});
  })
}
});

router.get('/users', function(req, res, next) {
  if(!req.session.user)
  {
    res.render('signin',{title: 'Log In',session:req.session.user,msg:'Please Sign in to continue...' ,layout: 'layout.hbs'});
  }
  else{
      User.find()
      .then(function(doc){
      res.render('system/users',{title: 'Users',user:doc,session:req.session.user,layout: 'dash.hbs'});
    });
  }
});

router.get('/vehicle', function(req, res, next) {
  if(!req.session.user)
  {
    res.render('signin',{title: 'Log In',msg:'Please Sign in to continue...' ,layout: 'layout.hbs'});
  }
  else
  {
    Post.find()
    .then(function(doc){
    res.render('users/vehicle',{title: 'Vehicles',session:req.session.user,post:doc,layout: 'dash.hbs'});
  })
}
});

router.get('/signin', function(req, res, next) {
  res.render('signin',{ title: 'Sign In',msg: msg ,layout: 'layout.hbs'});
});


router.get('/updateuser/:id', function(req, res, next) {
  var id=req.params.id;
  User.findById(id, function(err,doc){
    res.render('system/update-user',{title: 'Users',user:doc,id:id ,layout: 'dash.hbs',session:req.session.user});
  });
});

router.get('/qr/:id', function(req, res, next) {
  var id=req.params.id;
  User.findById(id, function(err,userqr){
    var datatoshow=('Name :'+userqr.name+', Email:'+userqr.email+', Contact:'+userqr.contact);
    console.log(datatoshow);
    res.redirect('https://api.qrserver.com/v1/create-qr-code/?size=750x750&data='+datatoshow);
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup',{title: 'Sign Up',layout: 'layout.hbs'});
});

router.get('/userprofile', function(req, res, next) {
    var userid=req.session.user._id;
    console.log(userid);
    Profile.findOne({'user': userid}, function(err,profile){
    res.render('users/userprofile',{title: 'User Profile',session:req.session.user,profile:profile,layout:'dash.hbs'});
    });
});

router.post('/update',function (req,res,next){
  var id=req.body.id;
  User.findById(id, function(err,doc){
    if(err){
      console.error('No User Found')
    }
    doc.name=req.body.name;
    doc.email=req.body.email;
    doc.contact=req.body.contact;
    doc.save();
    res.redirect('/users');
  });
});

router.get('/delete/:id',function (req,res,next){
  var id=req.params.id;
  User.findByIdAndRemove(id).exec();
  res.redirect('/users');
});

router.get('/delete-post/:id',function (req,res,next){
  var id=req.params.id;
  Post.findByIdAndRemove(id).exec();
  Post.find()
    .then(function(doc){
    res.render('system/posts',{title: 'Posts',session:req.session.user,post:doc,layout: 'dash.hbs'});
  });
});      

router.get('/logout',function (req,res,next){
  req.session.user="";
  console.log(req.session.user);
  res.render('signin',{title: 'Log In',msg:'Logged Out',layout: 'layout.hbs'});
});

router.get('/dashboard',function (req,res,next){
  if(!req.session.user)
  {
    res.render('signin',{title: 'Log In',msg:'Please Sign in to continue...' ,layout: 'layout.hbs'});
  }
  else{
    res.render('system/dashboard',{ title: 'Dashboard',session:req.session.user,layout: 'dash.hbs'});
    console.error('welcomeeee')
  }
});

module.exports = router;
