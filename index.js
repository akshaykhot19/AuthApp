const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT ;

app.use(express.json());

//Importing the database connection using mongoose and conneect method
require('./config/database').connect();

//mouting the routes
const user = require('./routes/user');
app.use('/api/v1', user);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



