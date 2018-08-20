var express = require('express');
var router = express.Router();
var users = require('./users');
// admin role check
router.use(function(req, res, next) {
  if(req.session.user.role == 'ADMIN'){
    next();
  }else{
    req.flash('warning', 'Not allowed user! Please login with admin account!')
    res.redirect('/signin');
  }
});

router.get('/', function(req, res){
  res.render('admin/home', {title: 'Admin home'});
});

router.use('/users',users);

module.exports = router;
