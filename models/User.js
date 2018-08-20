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
    var p = [];
    var sql = "SELECT uid, name,role, email, DATE_FORMAT(updated, '%d/%m/%Y %H:%i')AS updated FROM users";
    if(params[0] != ''|| params[2] != ''){
      sql += " WHERE";
      if(params[0] != ''){
      sql += " ( name LIKE concat('%',?,'%') OR email LIKE concat('%',?,'%') )";
      p.push(params[0]);
      p.push(params[1]);
      if(params[2] != '') sql += " AND";
  }

  if(params[2] != ''){
    sql += " role = ?";
    p.push(params[2]);
  }
}
  return db.query(sql, p, callback);
},
  compare: function(cleartext, encrypted){
    return bcrypt.compareSync(cleartext, encrypted);
  }
};

module.exports = User;
