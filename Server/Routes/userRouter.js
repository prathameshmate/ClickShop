import express from 'express';
import UserColl from '../Model/UserColl.js';

const router = new express.Router();

const responseFormat = {
  success: false,
  message: '',
  errorMessage: '',
};

router.post('/register', async (req, res) => {
    console.log('request is:>> ', req.body);
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

    const isUserExits = await UserColl.findOne({email: email});
    console.log('isUserExits :>> ', isUserExits);

    if (isUserExits) {
      res.status(422).json({
        ...responseFormat,
        errorMessage: 'This user already register with this email' + email,
      });
    } else {
      const userCrete = {
        fullName: fullname,
        userName: username,
        mobileNumber: number,
        email,
        password,
      };
      const documentCreate = await UserColl.insertMany([userCrete]);
      console.log('documentCreate :>> ', documentCreate);
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

export default router;
