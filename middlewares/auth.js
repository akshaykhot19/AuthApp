//3 middleware for authentication,isStudent,isAdmin

const jwt = require('jsonwebtoken');
require('dotenv').config();


//To Authenticate the user
//This middleware will check if the user is authenticated or not
exports.auth = async (req, res, next) => {
  try {
    //extracting the token from the request header
    const token = req.body.token ;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }
    //Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //If the token is valid, we can access the user information from the decoded token
    req.user = decoded;

    console.log(decoded);
    next();
    
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access - Invalid token',
    });
  }
}

exports.isStudent = async (req, res, next) => {
  try {
    //Check if the user is authenticated
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You do not have permission to access this resource',
      });
    }
    next();
  } catch (error) {
    console.error('Error in isStudent middleware:', error);
    return res.status(403).json({
      success: false,
      message: 'Forbidden - You do not have permission to access this resource',
    });
  }
}       

exports.isAdmin = async (req, res, next) => {
  try {
    //Check if the user is authenticated
    if (req.user.role !==  'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You do not have permission to access this resource',
      });
    }
    next();
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    return res.status(403).json({
      success: false,
      message: 'Forbidden - You do not have permission to access this resource',
    });
  }
}



