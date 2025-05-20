import mongoose from 'mongoose';

//create schema (used to create structure of documents)
const schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'please enter fullname'],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, 'please enter username'],
      trim: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Assuming a 10-digit mobile number format
        },
        message: props => `${props.value} is not a valid mobile number!`,
      },
    },
    email: {
      type: String,
      required: [true, 'plase enter email ID'],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, 'please add password'],
      min: 8,
      max: 64,
    },
    base64ProfileImg: {
      type: String,
      default: '',
    },
    token: [
      {
        token: {
          type: String,
          required: [true, 'please add token'],
        },
      },
    ],
    // confirmPassword: {
    //   type: String,
    //   required: [true, 'please add confirm password'],
    //   min: 8,
    //   max: 64,
    //   validate: {
    //     // Custom validator to ensure confirmPassword matches password
    //     validator: function (v) {
    //       return v === this.password;
    //     },
    //     message: 'Passwords do not match.',
    //   },
    // },
    role: {
      type: String,
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

//creting collection name as UserColl
const UserColl = new mongoose.model('UserColl', schema);

export default UserColl;
