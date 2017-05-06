var mongoose = require('mongoose');
//mongoose.connect('localhost:27017/proj')
var conn = mongoose.connection;

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
var User= require('../models/user');
passport.use(new FacebookStrategy({
    clientID: '284436565321204',
    clientSecret: '0e69ad0c54df16a85abe9483573cafcc' ,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'name', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile._json);
      var user={
        name:profile.name.givenName,
        email:profile._json.email
      };
      console.log(user)
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
  }
));