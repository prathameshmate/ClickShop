import mongoose from 'mongoose';

//create schema (used to create structure of documents)
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//creting collection name as UserColl
const UserColl = new mongoose.model('UserColl', schema);

export default UserColl;
