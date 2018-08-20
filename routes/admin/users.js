var express = require('express');
var router = express.Router();

var User = require('../../models/User');

router.all('/list', function(req, res, next){
  var params = [req.body.keyword || '', req.body.keyword || '', req.body.role || ''];
  User.find(params, function(err, users) {
    if (err) next (err);
    res.render('admin/users/user-list', {title: 'User List', users: users, search:{ keyword: req.body.keyword, role: req.body.role}});
  });
});

router.get('/view/:id', function(req, res, next){
  User.findById(req.params.id, function(err, users) {
    if (err) throw err;
    if(users.length == 0) next(new Error('User data not Found!'));
    res.render('admin/users/user-view', {title: 'View User', user: users[0]});
  });
});

router.get('/modify/:uid', function(req, res, next){
  User.findById(req.params.uid, function(err, users) {
    if (err) throw err;
    if(users.length == 0) next(new Error('User data not Found!'));
    res.render('admin/users/user-modify', {title: 'Modify User', user: users[0]});
  });
});

router.post('/modify', function(req, res, next) {
 var params = [req.body.name, req.body.role, req.body.uid];
 User.findById( req.body.uid,function(err, user) {
   if (err) throw err;
   if(user.length == 0) next(new Error('User data not found!'));
   User.update(params, function(uerr,uuser){
     if(uerr) throw uerr;
     req.flash('info', 'Success');
     res.redirect('/admin/users/view/'+ user[0].uid);
   });
 });
});
router.post('/remove', function(req, res, next) {
  User.remove(req.body.uid,function(err, user) {
      if (err) throw err;
      req.flash('info', 'Successfully');
    res.redirect('/admin/users/list');
  });
});

module.exports = router;
