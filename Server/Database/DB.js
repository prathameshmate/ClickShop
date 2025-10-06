import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';
dotenv.config();

const dbConection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION);
    console.log(
      `nodejs - mongobd connection successfully ${mongoose.connection.host}`
        .bgGreen.white,
    );
  } catch (err) {
    console.log(`Error while connecting to DB ${err}`.bgRed.white);
  }
};

export default dbConection;
