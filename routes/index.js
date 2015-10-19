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
    usersCollection.find({email: req.body.inputEmail}, function(err, record){
      if(record.length){
        errors.push('Email not available');
        res.render('sign', {title: 'G Class', subtitle: 'Try again', errors: errors})
      }
      else{
        usersCollection.insert({email: req.body.inputEmail, password: req.body.inputPassword}, function(err, record){
          res.render('index', { title: 'G Class' , subtitle: 'Signed In!', user: "user true"});
        })
      }
    })
  }
});

/* GET SignIn */
router.get('/signin', function(req, res, next) {
  res.render('sign', { title: 'G Class' , subtitle: "SignIn", signin: true});
});


/* POST SignIn */
router.post('/signin', function(req, res, next) {
  var errors = [];
  if(!req.body.inputEmail.trim())
    errors.push('Must enter email')
  if(!req.body.inputPassword.trim())
    errors.push('Must enter password')
  if (errors.length > 0)
    res.render('sign', {title: 'G Class', subtitle: 'Try again', errors: errors})
  else{
    usersCollection.findOne({email: req.body.inputEmail}, function(err, record){
      if(!record){
        errors.push('Record not found. Please check that your email is correct.');
        res.render('sign', {title: 'G Class', subtitle: 'Try again', errors: errors, signin:true})
      }
      else{
        if(record.password !== req.body.inputPassword){
          errors.push('Incorrect password');
          res.render('sign', {title: 'G Class', subtitle: 'Try again', errors: errors, signin:true}) 
        }
        else{
          res.render('index', {title: 'G Class', subtitle: 'Signed In!', user: "You're signed in " + req.body.inputEmail})
        }
      }
      // if(record){
      //   console.log("Record" + record.password)
      //   if(record.password == req.body.inputPassword){
      //     res.render('index', {title: 'G Class', subtitle: 'Signed In!', signin: true})
      //   }
      //   else{
      //     errors.push('Incorrect password')
      //   }
      // }
      // else{
      //   errors.push('Record not found. Please check that your email is correct.')
      // }
      // res.render('sign', {title: 'G Class', subtitle: 'Try again', errors: errors, signin:true})
    })
  }
});



module.exports = router;
