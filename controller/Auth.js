const bcrypt = require('bcrypt');
const user = require('../model/user');
const jwt = require('jsonwebtoken');

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


//Login route Handler
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' });
    }
    // Check if user exists
    const existingUser = await user.find({ email });
    if (existingUser.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' });
    }
    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser[0].password); 
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' });
    }

     // Generate a JWT token
     const token = jwt.sign(
      {email: existingUser[0].email ,id: existingUser[0]._id, role: existingUser[0].role }, // Payload
      process.env.JWT_SECRET, // Secret key (store this in your .env file)
      { expiresIn: '1h' } // Token expiration time
    );

    // Setting the token in the user object
    // This is just for demonstration purposes. In a real application, you would send the token to the client.
    //user.token = token;
    //user.password = undefined; // Remove the password from the user object before sending it to the client

    const UserObject = existingUser[0].toObject(); // Convert Mongoose document to plain object
    UserObject.token = token; // Add the token to the user object 
    UserObject.password=undefined; // Remove the password from the user object before sending it to the client

    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
      expires : new Date (Date.now() + 3 *24 *60 *60 *1000) // 3 days expiration
    }).status(200).json({ 
      success: true,
      message: 'Login successful',
      token, // Send the token to the client
      user : UserObject
    }); 

  }
  catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' });
  } 
}