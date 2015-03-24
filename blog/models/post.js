var mongodb = require('./db'),
    markdown = require('markdown').markdown;

function Post(name, title, post) {
  this.name = name;
  this.title = title;
  this.post = post;
}

module.exports = Post;

//Save post
Post.prototype.save = function(callback) {
  var date = new Date();
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }

  var post = {
      name: this.name,
      time: time,
      title: this.title,
      post: this.post,
      comments: []
  };

  //Open DB
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }

    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //Insert post into collection
      collection.insert(post, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);//error! return error
        }
        callback(null);
      });
    });
  });
};

//get post
Post.getAll = function(name, callback) {
  //open DB
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }

    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }
      //search posts
      collection.find(query).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        docs.forEach(function (doc) {
          doc.post = markdown.toHTML(doc.post);
        });
        callback(null, docs);
      });
    });
  });
};

//get one post
Post.getOne = function(name, day, title, callback) {
  //open DB
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //Read post collection
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //search in collection
      collection.findOne({
        "name": name,
        "time.day": day,
        "title": title
      }, function (err, doc) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        //markdown HTML
        if (doc) {
          doc.post = markdown.toHTML(doc.post);
          doc.comments.forEach(function (comment) {
            comment.content = markdown.toHTML(comment.content);
          });
        }
        callback(null, doc);
      });
    });
  });
};

//Return the post content (markdown format)
Post.edit = function(name, day, title, callback) {
  //Open DB
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //Read post collection
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //search post
      collection.findOne({
        "name": name,
        "time.day": day,
        "title": title
      }, function (err, doc) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, doc);//return a post content
      });
    });
  });
};


//Update post
Post.update = function(name, day, title, post, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //update post
      collection.update({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        $set: {post: post}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};


//Delete post
Post.remove = function(name, day, title, callback) {
  //open DB
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //read post collection
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //Search for the post
      collection.remove({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        w: 1
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
