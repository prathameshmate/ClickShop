import express from 'express';
import morgan from 'morgan';
import color from 'colors';
import dotenv from 'dotenv';
import dbConection from './Database/DB.js';

//importing all Environment varibale
dotenv.config();

//MONGODB connection
dbConection();

//REST Object
const app = express();

//middleware
app.use(express.json());
app.use(morgan('dev'));

//Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'welcome to nodejs application',
  });
});

//PORT
const PORT = process.env.PORT || 5000;

//Listing port number
app.listen(PORT, () => {
  console.log(`listing to the port :>> ${PORT}`.rainbow);
});
