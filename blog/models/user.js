var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

//Save user 
User.prototype.save = function(callback) {
  //Data we want to insert into DB
  var user = {
      name: this.name,
      password: this.password,
      email: this.email
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
