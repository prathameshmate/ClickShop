import express from 'express';
import morgan from 'morgan';
import color from 'colors';
import dotenv from 'dotenv';
import dbConection from './Database/DB.js';
import router from './Routes/userRouter.js';

//importing all Environment varibale
dotenv.config();

//MONGODB connection
dbConection();

//REST Object
const app = express();

//middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(router);

//Routes

//PORT
const PORT = process.env.PORT || 5000;

//Listing port number
app.listen(PORT, () => {
  console.log(`listing to the port :>> ${PORT}`.rainbow);
});
