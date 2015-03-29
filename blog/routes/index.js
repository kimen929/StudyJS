var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js');

module.exports = function(app) {
  app.get('/', function (req, res) {
    //judge whether the request is for the first page.
    var page = req.query.p ? parseInt(req.query.p) : 1;

    //search and return 10 posts per page.
    Post.getTen(null,page, function (err, posts,total) {
      if (err) {
        posts = [];
      } 
      res.render('index', {
        title: 'Home page',
        user: req.session.user,
        posts: posts,
        page : page,
        isFirstPage: (page -1) == 0,
        isLastPage: ((page -1) * 10 + posts.length) == total,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/register', function (req, res) {
    res.render('register', {
       title: 'Register',
       user: req.session.user,
       success: req.flash('success').toString(),
       error: req.flash('error').toString()
     });
  });
  app.post('/register', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //Check whether two password is same.
    if (password_re != password) {
      req.flash('error', 'Error! Password confirm failed'); 
      return res.redirect('/register');//redirect to register page
    }
    //use md5 to encrypt password
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });
    //Check whether user is already exists
    User.get(newUser.name, function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if (user) {
        req.flash('error', 'User already exists');
        return res.redirect('/register');//Redirect to register page
      }
      //If not exists, add new user 
      newUser.save(function (err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/register');
        }
        req.session.user = user;//Save session
        req.flash('success', 'Success!');
        res.redirect('/');//Redirect to home page
      });
    });
  });

  app.get('/login', function (req, res) {
      res.render('login', {
          title: 'Login',
          user: req.session.user,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()});
  });
  app.post('/login', function (req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.get(req.body.name, function (err, user) {
      if (!user) {
        req.flash('error', 'user not exists!'); 
        return res.redirect('/login');
      }
      if (user.password != password) {
        req.flash('error', 'Password wrong!'); 
        return res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', 'Success!');
      res.redirect('/');
    });
  });

  app.get('/post', checkLogin);
  app.get('/post', function (req, res) {
    res.render('post', {
      title: 'Publish',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });


  app.post('/post', checkLogin);
  app.post('/post', function (req, res) {
   var currentUser = req.session.user,
    tags = [req.body.tag1, req.body.tag2, req.body.tag3],
    post = new Post(currentUser.name, currentUser.head, req.body.title, tags, req.body.post);
    post.save(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      req.flash('success', 'Publish Success!');
      res.redirect('/');
    });
  });

  app.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', 'Log out success!');
    res.redirect('/');
  });

  app.get('/upload', checkLogin);
  app.get('/upload', function(req,res) {
    res.render('upload', {
      title: 'Upload file',
      user: req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });

  app.post('/upload', checkLogin);
  app.post('/upload', function(req, res) {
    req.flash('success', 'file upload success!');
    res.redirect('/upload');
  });


  app.get('/archive', function (req, res) {
    Post.getArchive(function(err, posts) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('archive', {
        title: 'Archive',
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error:req.flash('error').toString()
      });
    });
  });
 

  app.get('/tags', function (req, res) {
    Post.getTags(function (err, posts) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('tags', {
        title: 'Tags',
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/tags/:tag', function (req, res) {
    Post.getTag(req.params.tag, function (err, posts) {
      if (err) {
        req.flash('error',err); 
        return res.redirect('/');
      }
      res.render('tag', {
        title: 'TAG:' + req.params.tag,
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });


  app.get('/u/:name', function (req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //To check whether the user exists
    User.get(req.params.name, function (err, user) {
      if (!user) {
        req.flash('error', 'User not exists!'); 
        return res.redirect('/');//Redirect to home page
      }
      //Search for the users article
      Post.getTen(user.name, page, function (err, posts, total) {
        if (err) {
          req.flash('error', err); 
          return res.redirect('/');
        } 
        res.render('user', {
          title: user.name,
          posts: posts,
          page: page,
          isFirstPage: (page -1) == 0,
          isLastPage: ((page-1) * 10 + posts.length) == total,
          user : req.session.user,
          success : req.flash('success').toString(),
          error : req.flash('error').toString()
        });
      });
    }); 
  });

  app.get('/u/:name/:day/:title', function (req, res) {
    Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('article', {
        title: req.params.title,
        post: post,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/edit/:name/:day/:title', checkLogin);
  app.get('/edit/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      res.render('edit', {
        title: 'Edit Post',
        post: post,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.post('/edit/:name/:day/:title', checkLogin);
  app.post('/edit/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
      var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
      if (err) {
        req.flash('error', err); 
        return res.redirect(url);//Error! Return to the post page
      }
      req.flash('success', 'Edit success!');
      res.redirect(url);//Success!  Return to the post page
    });
  });


  app.get('/remove/:name/:day/:title', checkLogin);
  app.get('/remove/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', 'Delete success!');
      res.redirect('/');
    });
  });


app.get('/reprint/:name/:day/:title', checkLogin);
app.get('/reprint/:name/:day/:title', function (req, res) {
  Post.edit(req.params.name, req.params.day, req.params.title, function (err, post) {
    if (err) {
      req.flash('error', err); 
      return res.redirect(back);
    }
    var currentUser = req.session.user,
        reprint_from = {name: post.name, day: post.time.day, title: post.title},
        reprint_to = {name: currentUser.name, head: currentUser.head};
    Post.reprint(reprint_from, reprint_to, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', 'Reprint success!');
      var url = encodeURI('/u/' + post.name + '/' + post.time.day + '/' + post.title);
      //Redirect to the direction url
      res.redirect(url);
    });
  });
});

  app.post('/u/:name/:day/:title', function (req, res) {
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
               date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48"; 
    var comment = {
        name: req.body.name,
        head: head,
        email: req.body.email,
        website: req.body.website,
        time: time,
        content: req.body.content
    };
    var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
    newComment.save(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', 'Comment success!');
      res.redirect('back');
    });
  });

  app.get('/links', function (req, res) {
    res.render('links', {
      title: 'Links',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.get('/search', function (req, res) {
    Post.search(req.query.keyword, function (err, posts) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('search', {
        title: "SEARCH:" + req.query.keyword,
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.use(function (req, res) {
    res.render("404");
  });

  function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', 'Not loged!'); 
      res.redirect('/login');
    }
    next();
  }

  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', 'Logged in!'); 
      res.redirect('back');
    }
    next();
  }

};
