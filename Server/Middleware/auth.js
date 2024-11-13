import JWT from 'jsonwebtoken';
import UserColl from '../Model/UserColl.js';

export const deleteTokenFromDB = async (token = '', res) => {
  try {
    // Option 1
    await UserColl.updateOne(
      {'token.token': token}, // Match documents with the specific token in the array
      {$pull: {token: {token: token}}}, // Remove the matching token from the array
    );

    //option 2
    // const result = await UserColl.findOne({'token.token': token});

    // result.token = result.token.filter(element => {
    //   element.token !== token;
    // });

    // result.save();
  } catch (err) {
    res.status(498).json({
      success: false,
      message: '',
      errorMessage: 'Error while deleting token form DB' + err,
      data: {},
    });
  }
};

const auth = async (req, res, next) => {
  try {
    const {token} = req.body;

    JWT.verify(token, process.env.SECRET_KEY, async (err, userVerify) => {
      if (err) {
        res.status(498).json({
          success: false,
          message: '',
          errorMessage: 'Session Expire because ' + err?.message,
          data: {},
        });

        // need to delete token which store in mongoDB ( In case of token expire)
        deleteTokenFromDB(token, res);
      } else {
        const resultDoc = await UserColl.findOne({
          mobileNumber: userVerify.mobileNumber,
        });
        req.body.resultDoc = resultDoc;
        next();
      }
    }); // { mobileNumber: 8007789330, iat: 1731419500, exp: 1731423100 }
  } catch (err) {
    // need to delete token which store in mongoDB ( In case of token expire)
    deleteTokenFromDB(token, res);
    res.status(498).json({
      success: false,
      message: '',
      errorMessage: 'Session Expire because ' + err,
      data: {},
    });
  }
};

export default auth;
