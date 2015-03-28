var mongodb = require('./db');
var crypto = require('crypto');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

//Save user 
User.prototype.save = function(callback) {
  var md5 = crypto.createHash('md5'),
      email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
      head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
  //Data we want to insert into DB
  var user = {
      name: this.name,
      password: this.password,
      email: this.email,
      head: head
  };

  //Open DB
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//return error message
    }
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//return error message
      }
      //Insert user
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//return error message
        }
        callback(null, user[0]);//Success！
      });
    });
  });
};

//read user information
User.get = function(name, callback) {
  //open DB
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//return error message
    }
    //read user 
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//return error message
      }
      //fine username (name key) value name 
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//return error message
        }
        callback(null, user);//Success!
      });
    });
  });
};
