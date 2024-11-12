import JWT from 'jsonwebtoken';
import UserColl from '../Model/UserColl.js';

const auth = async (req, res, next) => {
  try {
    const {token} = req.body;

    JWT.verify(token, process.env.SECRET_KEY, async (err, userVerify) => {
      if (err) {
        res.status(498).json({
          success: false,
          message: '',
          errorMessage: 'You need to login because ' + err?.message,
          data: {},
        });
      } else {
        const resultDoc = await UserColl.findOne({
          mobileNumber: userVerify.mobileNumber,
        });
        req.body.resultDoc = resultDoc;
        next();
      }
    }); // { mobileNumber: 8007789330, iat: 1731419500, exp: 1731423100 }
  } catch (err) {
    res.status(498).json({
      success: false,
      message: '',
      errorMessage: 'You need to login because ' + err,
      data: {},
    });
  }
};

export default auth;
