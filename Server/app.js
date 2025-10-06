import express from 'express';
import morgan from 'morgan';
import color from 'colors';
import dotenv from 'dotenv';
import dbConection from './Database/DB.js';
import router from './Routes/userRouter.js';

import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Serve images from /public folder
app.use('/products', express.static(path.join(__dirname, 'Public/products')));
app.use('/front', express.static(path.join(__dirname, 'Public/front')));
app.use(
  '/shoesAndOther',
  express.static(path.join(__dirname, 'Public/shoesAndOther')),
);

//PORT
const PORT = process.env.PORT || 5000;

//Listing port number
app.listen(PORT, () => {
  console.log(`listing to the port :>> ${PORT}`.rainbow);
});
