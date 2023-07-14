const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const dbConnect = require('./config/dbconnection');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRouter = require('./routes/authRout');
const cookiePasrser = require('cookie-parser');
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookiePasrser());

app.use('/api/user', authRouter);

app.use(notFound);
app.use(errorHandler); // Fixed typo here

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
