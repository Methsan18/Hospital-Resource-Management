const jwt = require('jsonwebtoken');
const ENV = require('../config.js');
const UserModel = require('../models/User.js').default;
const { UserSchema } = require('../models/User.js');

/** auth middleware */
async function Auth(req, res, next){
    try {
        
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];

        // retrive the user details fo the logged in user
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
 
        req.user = decodedToken;

        next()

    } catch (error) {
        res.status(401).json({ error : "Authentication Failed!"})
    }
}


 function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
}

// export const adminOnly=async(req,res,next)=>{
//     const user = await UserModel.findOne({
//         where:{
//             uuid:req.session.UserModel.username
//         }
//     });
//     if(!user) return res.status(404).json({msg:"User does not exist"})
//     if(UserModel.role !== "admin") return res.status(403).json({msg:"Forbidden access"})
//     next();
// }

module.exports = {
    Auth,
    localVariables: localVariables
  };
