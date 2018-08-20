var db = require('../dbconn');
var bcrypt = require('bcrypt-nodejs');

var User = {
  add: function(params, callback){
    var sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    params[2] = bcrypt.hashSync(params[2], bcrypt.genSaltSync(8), null);
    return db.query(sql, params, callback);
  },
  findByEmail: function(email, callback){
    console.log('email',email);
    var sql = 'SELECT * FROM users WHERE email = ?';
    return db.query(sql, [email], callback);
  },
  compare: function(cleartext, encrypted){
    return bcrypt.compareSync(cleartext, encrypted);
  }
};

module.exports = User;
