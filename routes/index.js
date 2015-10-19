var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/authentication-assessment');
var usersCollection = db.get('usersCollection');
var studentsCollection = db.get('studentsCollection');
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET SignUp */
router.get('/signup', function(req, res, next) {
  res.render('sign');
});

/* POST SignUp */
router.post('/signup', function(req, res, next) {
  var errors = [];
  if(!req.body.inputEmail.trim())
    errors.push('Must enter email')
  if(!req.body.inputPassword.trim())
    errors.push('Must enter password')
  if (errors.length > 0)
    res.render('sign', {signInPage: true, errors: errors})
  else{
    usersCollection.find({email: req.body.inputEmail}, function(err, record){
      if(record.length){
        errors.push('Email not available');
        res.render('sign', {errors: errors})
      }
      else{
        req.session.email = req.body.inputEmail;
        var hashedPassword = bcrypt.hashSync(req.body.inputPassword, 8);
        usersCollection.insert({email: req.body.inputEmail, hashedPassword: hashedPassword}, function(err, record){
          res.render('index', { session_id: req.session.email});
        })
      }
    })
  }
});

/* GET SignIn */
router.get('/signin', function(req, res, next) {
  res.render('sign', { signInPage: true});
});


/* POST SignIn */
router.post('/signin', function(req, res, next) {
  var errors = [];
  if(!req.body.inputEmail.trim())
    errors.push('Must enter email')
  if(!req.body.inputPassword.trim())
    errors.push('Must enter password')
  if (errors.length > 0)
    res.render('sign', { errors: errors})
  else{
    usersCollection.findOne({email: req.body.inputEmail}, function(err, record){
      if(!record){
        errors.push('Record not found. Please check that your email is correct.');
        res.render('sign', {errors: errors, signInPage:true})
      }
      else{
        if(bcrypt.compareSync(req.body.inputPassword, record.hashedPassword)){
          req.session.email = req.body.inputEmail;
          res.render('index', {session_id: req.session.email})
        }
        else{
          errors.push('Incorrect password');
          res.render('sign', {errors: errors, signInPage:true}) 
        }
      }
    })
  }
});


router.get('/logout', function(req, res, next){
  req.session = null;
  res.redirect('/')
})

router.get('/new', function(req, res, next){
  res.render('new', {session_id: req.session.email})
})

router.post('/new', function(req, res, next){
  var errors = [];
  if(!req.body.inputName){
    errors.push('Name must be entered')
  }
  if(!req.body.inputPhone){
    errors.push('Phone number must be entered')
  }
  if (errors.length > 0){
    res.render('new', {session_id: req.session.email, errors: errors})
  }
  else{
    studentsCollection.findOne({name: req.body.inputName}, function(err, record){
      if(record){
        errors.push('Email not available')
        res.render('new', {session_id: req.session.email, errors: errors})
      }
      else{   
        studentsCollection.insert({name: req.body.inputName, phone: req.body.inputPhone}, function(err, record){
          res.render('index', {statusSignedIn: true,  session_id: req.session.email})
        }) 
      }  
    })
  }  
})

router.get('/all_students', function(req, res, next){
  studentsCollection.find({}, function(err, record){
    res.render('students', {session_id: req.session.email, allStudents: record})
  })
})

router.get('/students/:name', function(req, res, next){
  studentsCollection.findOne({name: req.params.name}, function(err, record){
    res.render('profile', {session_id: req.session.email, profile: record})
  })
})



module.exports = router;
