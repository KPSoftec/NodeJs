var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register',function(req,res){
res.render('register');
});

// Login
router.get('/login',sureAuthenticated,function(req,res){
res.render('login');
});

function sureAuthenticated(req,res,next)
{
    if(req.isAuthenticated()){
            res.redirect('/');
    }else{
        return next();
    }
}

// Register User
router.post('/register',function(req,res){
    var username =req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;

//Validation
    req.checkBody('username','username is Required').notEmpty();
    req.checkBody('email','Please provide Email.').notEmpty();
    req.checkBody('email','Please provide correct Email.').isEmail();
    req.checkBody('password','Please provide password.').notEmpty();
    req.checkBody('cpassword','Password does not match.').equals(req.body.password);
    
    var errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors:errors
        });
    }else{  
        var newUser = new User({
            username:username,
            email:email,
            password:password
        });

        User.createUser(newUser,function(err, user){
            if(err) throw err;
            req.flash('error_msg','Something went wrong , Please try again. ');
        });

        req.flash('success_msg','You are now Registered and can Login. ');

        res.redirect('/users/login');

    }
});


passport.use(new LocalStrategy(
  function(username, password, done) {
      if(username.indexOf('@')>0)
        User.getUserByEmail(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null,false,{message:'Unkknown User'});
            }
    
            User.comparePassword(password,user.password, function(err, isMatch){
                if(err) throw err ;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, faalse , {message:"Password Mismatch"});
                }
            });
        }); 
      else
    User.getUserByUserName(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null,false,{message:'Unkknown User'});
        }

        User.comparePassword(password,user.password, function(err, isMatch){
            if(err) throw err ;
            if(isMatch){
                return done(null, user);
            }else{
                return done(null, faalse , {message:"Password Mismatch"});
            }
        });
    });    
  }));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login',failureFlash:true}),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/');
  });

router.get('/logout',function(req,res){
    req.logout();

    req.flash('success_msg','You are LoggedOut');

    res.redirect('/users/login');
});

module.exports= router;