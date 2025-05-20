import express from 'express';
import UserColl from '../Model/UserColl.js';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import auth, {deleteTokenFromDB} from '../Middleware/auth.js';
import {Products} from '../Product/Product.js';

//importing all Environment varibale
dotenv.config();

const router = new express.Router();

const responseFormat = {
  success: false,
  message: '',
  errorMessage: '',
  data: {},
};

// API for User Registration
router.post('/launchDetails', auth, async (req, res) => {
  try {
    const {deviceID} = req.body;

    res.status(200).json({
      ...responseFormat,
      data: Products,
      success: true,
      message: 'Success',
    });
  } catch (err) {
    res.status(422).json({
      ...responseFormat,
      errorMessage: `Error while launchDetails : ${err}`,
    });
  }
});

// API for User Registration
router.post('/register', async (req, res) => {
  try {
    const {fullname, username, number, email, password} = req.body;

    //validation
    if (!fullname || !username || !number || !email || !password) {
      res.status(400).json({
        ...responseFormat,
        errorMessage: 'please fill all the fields',
      });
    }
    //check user already exit or not
    const isEmailExists = await UserColl.findOne({email});
    const isMobileExists = await UserColl.findOne({mobileNumber: number});

    if (isEmailExists) {
      res.status(422).json({
        ...responseFormat,
        errorMessage: 'This user already register with this email ' + email,
      });
    } else if (isMobileExists) {
      res.status(422).json({
        ...responseFormat,
        errorMessage:
          'This user already register with this mobile number ' + number,
      });
    } else {
      // encrypt the password before storing

      const hashPassword = await bcrypt.hash(password, 12);
      const userCrete = {
        fullName: fullname,
        userName: username,
        mobileNumber: number,
        email,
        password: hashPassword,
      };
      const documentCreate = await UserColl.insertMany([userCrete]);
      res.status(200).json({
        ...responseFormat,
        success: true,
        message: 'Registration successfully please login',
      });
    }
  } catch (err) {
    res.status(422).json({
      ...responseFormat,
      errorMessage: `Error while Registering user : ${err}`,
    });
  }
});

// API for User Login
router.post('/login', async (req, res) => {
  try {
    const {number, password} = req.body;

    //validation
    if (!number || !password) {
      res.status(400).json({
        ...responseFormat,
        errorMessage: 'please enter mobile number and password for login',
      });
    }

    // used to check login user present in DB or not
    const result = await UserColl.findOne({mobileNumber: number});
    if (result) {
      const comparePass = await bcrypt.compare(password, result.password);
      if (comparePass) {
        const token = JWT.sign(
          {mobileNumber: result.mobileNumber},
          process.env.SECRET_KEY,
          {expiresIn: '5m'},
        ); // generate jwt with 1 hr expiration time

        // store token in DB
        result.token = result.token.concat({
          token: token,
        });

        await result.save();

        res.status(200).json({
          ...responseFormat,
          success: true,
          message: 'Login Successfully',
          data: {
            fullname: result?.fullName,
            username: result?.userName,
            number: result?.mobileNumber,
            email: result?.email,
            token: token,
            Products: Products,
          },
        });
      } else {
        res.status(422).json({
          ...responseFormat,
          errorMessage: 'Invalid Password',
        });
      }
    } else {
      res.status(422).json({
        ...responseFormat,
        errorMessage: 'Invalid Mobile Number',
      });
    }
  } catch (err) {
    res.status(422).json({
      ...responseFormat,
      errorMessage: `Error while Login user : ${err}`,
    });
  }
});

// API for User Profile
router.post('/profile', auth, (req, res) => {
  try {
    const userData = req.body.resultDoc;
    res.status(200).json({
      ...responseFormat,
      success: true,
      message: 'profile verify successfully',
      data: {
        fullname: userData?.fullName,
        username: userData?.userName,
        number: userData?.mobileNumber,
        email: userData?.email,
        base64ProfileImg: userData?.base64ProfileImg,
      },
    });
  } catch (err) {
    res.status(422).json({
      ...responseFormat,
      errorMessage: `Error while calling profile API : ${err}`,
    });
  }
});

// API for User LogOut
router.post('/logout', (req, res) => {
  try {
    const {token} = req.body;
    deleteTokenFromDB(token, res);
    res.status(200).json({
      ...responseFormat,
      success: true,
      message: 'Logout sucessfully',
    });
  } catch (err) {
    res.status(422).json({
      ...responseFormat,
      errorMessage: `Error while calling logout API : ${err}`,
    });
  }
});

//API for update user profile
router.post('/update', auth, async (req, res) => {
  try {
    const {fullName, userName, email} = req.body;

    if (fullName && userName && email) {
      const userData = req?.body?.resultDoc;

      userData.fullName = fullName;
      userData.userName = userName;
      userData.email = email;

      await userData?.save();

      res.status(200).json({
        ...responseFormat,
        success: true,
        data: {
          fullname: userData?.fullName,
          username: userData?.userName,
          email: userData?.email,
        },
        message: 'Profile data update sucessfully',
      });
    } else {
      res.status(422).json({
        ...responseFormat,
        errorMessage: 'please fill all the fields',
      });
    }
  } catch (err) {
    res.status(422).json({
      ...responseFormat,
      errorMessage: `Error while calling update profile API : ${err}`,
    });
  }
});
//API for update profile photo
router.post('/setProfilePhoto', auth, async (req, res) => {
  try {
    const {base64ProfileImg} = req.body;

    if (base64ProfileImg) {
      const userData = req?.body?.resultDoc;

      userData.base64ProfileImg = base64ProfileImg;

      await userData?.save();

      res.status(200).json({
        ...responseFormat,
        success: true,
        data: {},
        message: 'Profile Image set sucessfully',
      });
    } else {
      res.status(422).json({
        ...responseFormat,
        errorMessage: 'please add profile photo',
      });
    }
  } catch (err) {
    res.status(422).json({
      ...responseFormat,
      errorMessage: `Error while setting profile Photo API : ${err}`,
    });
  }
});

export default router;
