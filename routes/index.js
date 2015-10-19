var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/authentication-assessment');
var usersCollection = db.get('usersCollection');
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'G Class' });
});

/* GET SignUp */
router.get('/signup', function(req, res, next) {
  res.render('sign', { title: 'G Class'});
});

/* POST SignUp */
router.post('/signup', function(req, res, next) {
  var errors = [];
  if(!req.body.inputEmail.trim())
    errors.push('Must enter email')
  if(!req.body.inputPassword.trim())
    errors.push('Must enter password')
  if (errors.length > 0)
    res.render('sign', {title: 'G Class - Try again', errors: errors})
  else{
    usersCollection.find({email: req.body.inputEmail}, function(err, record){
      if(record.length){
        errors.push('Email not available');
        res.render('sign', {title: 'G Class - Try again', errors: errors})
      }
      else{
        req.session.email = req.body.inputEmail;
        var hashedPassword = bcrypt.hashSync(req.body.inputPassword, 8);
        usersCollection.insert({email: req.body.inputEmail, hashedPassword: hashedPassword}, function(err, record){
          res.render('index', { title: 'G Class', statusSignedIn: true, session_id: req.session.email});
        })
      }
    })
  }
});

/* GET SignIn */
router.get('/signin', function(req, res, next) {
  res.render('sign', { title: 'G Class', signinPage: true});
});


/* POST SignIn */
router.post('/signin', function(req, res, next) {
  var errors = [];
  if(!req.body.inputEmail.trim())
    errors.push('Must enter email')
  if(!req.body.inputPassword.trim())
    errors.push('Must enter password')
  if (errors.length > 0)
    res.render('sign', {title: 'G Class - Try again', errors: errors})
  else{
    usersCollection.findOne({email: req.body.inputEmail}, function(err, record){
      if(!record){
        errors.push('Record not found. Please check that your email is correct.');
        res.render('sign', {title: 'G Class - Try again', errors: errors, signinPage:true})
      }
      else{
        if(bcrypt.compareSync(req.body.inputPassword, record.hashedPassword)){
          req.session.email = req.body.inputEmail;
          res.render('index', {title: 'G Class', session_id: req.session.email, statusSignedIn: true})
        }
        else{
          errors.push('Incorrect password');
          res.render('sign', {title: 'G Class - Try again', errors: errors, signinPage:true}) 
        }
      }
    })
  }
});


router.get('/logout', function(req, res, next){
  req.session = null;
  res.redirect('/')
})




module.exports = router;
