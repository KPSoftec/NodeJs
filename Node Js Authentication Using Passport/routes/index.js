var express = require('express');
var router = express.Router();

//Get Home page 
router.get('/',ensureAuthenticated,function(req,res){
res.render('index');
});



function ensureAuthenticated(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg','You are Not Logged In');
        res.redirect('/users/login');
    }
}


module.exports= router;