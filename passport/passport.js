var FacebookStrategy = require('passport-facebook').Strategy;
var User=require('../models/user.js');
var session = require('express-session');


module.exports = function(app, passport){

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))


  passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

  passport.use(new FacebookStrategy({
    clientID: '284436565321204',
    clientSecret: '0e69ad0c54df16a85abe9483573cafcc',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    //User.findOrCreate(..., function(err, user) {
    //  if (err) { return done(err); }
    //  done(null, user);
    //});
    done(null, profile);
  }
));
app.get('/auth/facebook',
passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});
  return passport;
}
