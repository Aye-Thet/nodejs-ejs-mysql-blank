var express = require('express');
var router = express.Router();

var User = require('../../models/User');

router.all('/list', function(req, res, next){
  var p = {
    currPage: Number(req.query.p) || 1,
    perPage: Number(req.query.ps) || 3, // TODO page size
    pSize:3
  };
  var params = [req.body.keyword || '', req.body.keyword || '', req.body.role || '',
                p.perPage, (p.currPage-1)*p.perPage];
  var orderby = [req.body.sortField||'updated', req.body.sortOrder||'DESC'];

  User.find(params, orderby, function(err, count, users) {
    console.log('users', users);
    if (err) next (err);
    p.count = count;
    p.last = Math.ceil(count/p.perPage);
    p.prev = (p.currPage==1)?null:(p.currPage-1);
    p.next = (p.currPage==p.last)?null:(p.currPage+1);
    p.pages = [];
    var end = p.pSize * Math.ceil(p.currPage/p.perPage);
    var start = end - p.pSize +1;
    end = (end > p.last)?p.last:end;
    for(var i= start; i <= end; i++) p.pages.push(i);

    // console.log('count of datas', count);
    res.render('admin/users/user-list', {
      title: 'User List',
      users: users,
      search:{ keyword: req.body.keyword, role: req.body.role},
      sort: {field:orderby[0], order:orderby[1]},
      paging: p
    });
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

router.get('/add', function(req, res, next) {
  res.render('admin/users/user-add', {title: 'Add User'});
});

router.post('/add', function(req, res, next) {
  var params = [req.body.name, req.body.email, req.body.password, 'USER'];
  User.findByEmail(req.body.email, function(err, rows) {
    if (err) throw err;
    if (rows.length > 0) {
      req.flash('warn', 'Duplicated email!!!');
      res.redirect('/add');
    } else {
      User.add(params, function(err2, result) {
        if (err2) throw err2;
        // console.log('check id', result);
        req.flash('warn', 'Insert Success');
        res.redirect('/admin/users/view/'+ result.insertId);
      });
    }
  });
});

module.exports = router;
