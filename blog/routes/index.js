var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');

module.exports = function(app) {
  app.get('/', function (req, res) {
    Post.get(null, function (err, posts) {
      if (err) {
        posts = [];
      } 
      res.render('index', {
        title: 'Home page',
        user: req.session.user,
        posts: posts,
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
        post = new Post(currentUser.name, req.body.title, req.body.post);
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
