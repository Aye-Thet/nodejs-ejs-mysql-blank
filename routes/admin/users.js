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

module.exports = router;
