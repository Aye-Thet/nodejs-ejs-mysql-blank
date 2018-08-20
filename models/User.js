var db = require('../dbconn');
var bcrypt = require('bcrypt-nodejs');

var User = {
  add: function(params, callback){
    var sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    params[2] = bcrypt.hashSync(params[2], bcrypt.genSaltSync(8), null);
    return db.query(sql, params, callback);
  },
  findByEmail: function(email, callback){
    var sql = "SELECT * FROM users WHERE email = ?";
    return db.query(sql, [email], callback);
  },
  find: function(params, callback){
    var sql = "SELECT uid, name,role, email, DATE_FORMAT(updated, '%d/%m/%Y %H:%i')AS updated FROM users";
    if(params[0] != '')
      sql += " WHERE name LIKE concat('%',?,'%') OR email LIKE concat('%',?,'%')";
    return db.query(sql, params, callback);
  },
  compare: function(cleartext, encrypted){
    return bcrypt.compareSync(cleartext, encrypted);
  }
};

module.exports = User;
