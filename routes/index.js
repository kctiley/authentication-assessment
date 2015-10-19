var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/authentication-assessment');
var usersCollection = db.get('usersCollection');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'G Class' });
});

/* GET SignUp */
router.get('/signup', function(req, res, next) {
  res.render('sign', { title: 'G Class' , subtitle: "SignUp"});
});

/* POST SignUp */
router.post('/signup', function(req, res, next) {
  var errors = [];
  if(!req.body.inputEmail.trim())
    errors.push('Must enter email')
  if(!req.body.inputPassword.trim())
    errors.push('Must enter password')
  if (errors.length > 0)
    res.render('sign', {title: 'G Class', subtitle: 'Try again', errors: errors})
  else{
    usersCollection.insert({email: req.body.inputEmail, password: req.body.inputPassword}, function(err, record){
      res.render('index', { title: 'G Class' , user: "You are signed in."});
    })
  }
});

module.exports = router;
