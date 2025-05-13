const express = require('express');
const router = express.Router();

const {login,signup} = require('../controller/Auth');

const { auth,isStudent,isAdmin}= require('../middlewares/auth');

router.post('/login', login);

router.post('/signup', signup);

router.get('/test', auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the test route',
  });
});

//Protected routes
router.get('/student',auth,isStudent , (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the protected path for students',  
  });
});


//Protected routes
router.get('/admin',auth,isAdmin , (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the protected path for admins',  
  });
});

module.exports = router;
