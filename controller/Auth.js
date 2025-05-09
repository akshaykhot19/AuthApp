const bcrypt = require('bcrypt');
const user = require('../model/user');

//Signup route Handler
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await user.find ({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' });
    } 
    let hashedPassword;
    // Hash the password to secure it
    try {
    //Arguments: password, saltRounds
    //Salt rounds is the cost factor that controls how much time is needed to calculate a single Hash
    //Higher the salt rounds, more secure the hash is but it takes more time to generate
    //Lower the salt rounds, less secure the hash is but it takes less time to generate
    //10 is a good default value for salt rounds    
       hashedPassword = await bcrypt.hash(password, 10);
    }
    catch (error) {
      console.error('Error hashing password:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Internal server error' });   
    }

    // Create a new user
    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
      role
    })
    return res.status(201).json({ 
      success: true,
      message: 'User created successfully',
    });

}
    catch (error) {
      console.error('Error during signup:', error);
      return res.status(500).json({ 
        success: false,
        message: 'User cannot be registered , Please try again later' });
    }}