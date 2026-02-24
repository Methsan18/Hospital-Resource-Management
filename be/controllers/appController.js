const UserModel = require('../models/User.js');
const { UserSchema } = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ENV = require('../config.js')
const otpGenerator = require('otp-generator');

/** middleware for verify user */
 async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


/** POST: http://localhost:8070/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/

async function register(req, res) {
    try {
        const { username, password, profile, email, role } = req.body;

        // Check for existing username
        const existUsername = await UserModel.findOne({ username });
        if (existUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }

        // Check for existing email
        const existEmail = await UserModel.findOne({ email });
        if (existEmail) {
            return res.status(400).send({ error: "Please use a unique email" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || '',
            email,
            role: role || 'user' // Default role is 'user' if not provided
        });

        // Save the user to the database
        await user.save();

        // Send success response
        return res.status(201).send({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
}
//  async function register(req,res){

//     try {
//         const { username, password, profile, email,role } = req.body;        

//         // check the existing user
//         const existUsername = new Promise((resolve, reject) => {
//             UserModel.findOne({ username }, function(err, user){
//                 if(err) reject(new Error(err))
//                 if(user) reject({ error : "Please use unique username"});

//                 resolve();
//             })
//         });

//         // check for existing email
//         const existEmail = new Promise((resolve, reject) => {
//             UserModel.findOne({ email }, function(err, email){
//                 if(err) reject(new Error(err))
//                 if(email) reject({ error : "Please use unique Email"});

//                 resolve();
//             })
//         });


//         Promise.all([existUsername, existEmail])
//             .then(() => {
//                 if(password){
//                     bcrypt.hash(password, 10)
//                         .then( hashedPassword => {
                            
//                             const user = new UserModel({
//                                 username,
//                                 password: hashedPassword,
//                                 profile: profile || '',
//                                 email,
//                                 role:'user'
//                             });

//                             // return save result as a response
//                             user.save()
//                                 .then(result => res.status(201).send({ msg: "User Register Successfully"}))
//                                 .catch(error => res.status(500).send({error}))

//                         }).catch(error => {
//                             return res.status(500).send({
//                                 error : "Enable to hashed password"
//                             })
//                         })
//                 }
//             }).catch(error => {
//                 return res.status(500).send({ error })//error inside above then-catch
//             })


//     } catch (error) {
//         return res.status(500).send(error);
//     }

// }


/** POST: http://localhost:8070/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/

async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).send({ error: "Username not found" });

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return res.status(400).send({ error: "Password does not match" });

        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            ENV.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).send({
            message: "Login successful",
            username: user.username,
            role: user.role,
            token
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
}

//  async function login(req,res){
   
//     const { username, password,role } = req.body;

//     try {
        
//         UserModel.findOne({ username })
//             .then(user => {
//                 bcrypt.compare(password, user.password)
//                     .then(passwordCheck => {

//                         if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

//                         // create jwt token
//                         const token = jwt.sign({
//                                         userId: user._id,
//                                         username : user.username,
//                                         role:user.role
//                                     }, ENV.JWT_SECRET , { expiresIn : "24h"});

//                         return res.status(200).send({
//                             msg: "Login Successful...!",
//                             username: user.username,
//                             role:user.role,
//                             token
//                         });                                    

//                     })
//                     .catch(error =>{
//                         return res.status(400).send({ error: "Password does not Match"})
//                     })
//             })
//             .catch( error => {
//                 return res.status(404).send({ error : "Username not Found"});
//             })

//     } catch (error) {
//         return res.status(500).send({ error});
//     }
// }


/** GET: http://localhost:8070/api/user/example123 */

async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) return res.status(501).send({ error: "Invalid Username" });

        const user = await UserModel.findOne({ username });

        if (!user) return res.status(404).send({ error: "Couldn't Find the User" });

        /** remove password from user */
        // Mongoose returns unnecessary data with object so convert it into JSON
        const { password, ...rest } = user.toJSON();

        return res.status(201).send(rest);
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

//  async function getUser(req,res){
    
//     const { username } = req.params;

//     try {
        
//         if(!username) return res.status(501).send({ error: "Invalid Username"});

//         UserModel.findOne({ username }, function(err, user){
//             if(err) return res.status(500).send({ err });
//             if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

//             /** remove password from user */
//             // mongoose return unnecessary data with object so convert it into json
//             const { password, ...rest } = Object.assign({}, user.toJSON());

//             return res.status(201).send(rest);
//         })

//     } catch (error) {
//         return res.status(404).send({ error : "Cannot Find User Data"});
//     }

// }


/** PUT: http://localhost:8070/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/


//  async function updateUser(req,res){
//     try {
        
//         // const id = req.query.id;
//         const { userId } = req.user;//error find

//         if(userId){
//             const body = req.body;

//             // update the data
//             UserModel.updateOne({ _id : userId }, body, function(err, data){
//                 if(err) throw err;

//                 return res.status(201).send({ msg : "Record Updated...!"});
//             })

//         }else{
//             return res.status(401).send({ error : "User Not Found...!"});
//         }

//     } catch (error) {
//         return res.status(401).send({ error });
//     }
// }


async function updateUser(req, res) {
    try {
        if (!req.user) {
            return res.status(401).send({ error: "User Not Found" });
        }

        const { userId } = req.user;

        if (!userId) {
            return res.status(401).send({ error: "User ID Not Found" });
        }

        const body = req.body;

        // Update the data
        await UserModel.updateOne({ _id: userId }, body).exec();

        return res.status(201).send({ msg: "Record Updated" });
    } catch (error) {
        return res.status(500).send({ error: error.message || "Internal Server Error" });
    }
}




/** GET: http://localhost:8070/api/generateOTP */
 async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}




/** GET: http://localhost:8070/api/verifyOTP */
async function verifyOTP(req, res) {
    const { code } = req.query;

    // Check if req.app.locals.OTP exists and is a valid number
    if (!req.app.locals.OTP || isNaN(req.app.locals.OTP)) {
        return res.status(400).send({ error: "OTP not generated or invalid" });
    }

    if (req.app.locals.OTP === code) { // Using strict equality
        req.app.locals.OTP = null; // Reset the OTP value
        req.app.locals.resetSession = true; // Start session for reset password
        return res.status(200).send({ msg: 'Verification Successful!' }); // Changed status to 200 OK
    }

    return res.status(400).send({ error: "Invalid OTP" });
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8070/api/createResetSession */
 async function createResetSession(req,res){
   if(req.app.locals.resetSession){
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Session expired!"})
}


// update the password when we have valid session
/** PUT: http://localhost:8070/api/resetPassword */


async function resetPassword(req, res) {
    try {

        const { username, password } = req.body;

        const user = await UserModel.findOne({ username });

        if (!user) return res.status(404).send({ error: "Username not Found" });

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

        req.app.locals.resetSession = false; // reset session
        return res.status(201).send({ msg: "Password Reset Successfully" });

    } catch (error) {
        return res.status(500).send({ error: error.message || "Internal Server Error" });
    }
}


//  async function resetPassword(req,res){
//     try {
        
//         if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

//         const { username, password } = req.body;

//         try {
            
//             UserModel.findOne({ username})
//                 .then(user => {
//                     bcrypt.hash(password, 10)
//                         .then(hashedPassword => {
//                             UserModel.updateOne({ username : user.username },
//                             { password: hashedPassword}, function(err, data){
//                                 if(err) throw err;
//                                 req.app.locals.resetSession = false; // reset session
//                                 return res.status(201).send({ msg : "Record Updated...!"})
//                             });
//                         })
//                         .catch( e => {
//                             return res.status(500).send({
//                                 error : "Enable to hashed password"
//                             })
//                         })
//                 })
//                 .catch(error => {
//                     return res.status(404).send({ error : "Username not Found"});
//                 })

//         } catch (error) {
//             return res.status(500).send({ error })
//         }

//     } catch (error) {
//         return res.status(401).send({ error })
//     }
// }

//Admin
/** GET: http://localhost:8070/api/getUsers */

 async function getUsers(req,res) {
    UserModel.find()
    .then(users=>res.json(users))
    .catch(err=>res.json(err))

}


/** PUT: http://localhost:8070/api/update */
  async function updateUsers(req,res) {
    try{
    console.log(req.body)
    const{username,...rest}=req.body 

    console.log(rest)
    await UserModel.updateOne({username:username},rest)
    res.status(200).json({msg:"User updated successfully"});
    }catch(error){
        res.status(500).json({error:err});
    }

 }


/** DELETE: http://localhost:8070/api/delete/:id */
 async function deleteUser(req,res) {
    
    const id=req.params.id
    console.log(id)
    const data= await UserModel.deleteOne({_id:id})
    res.send({success : true , message:"data delete successfully",data:data})
}

 async function getU(req,res) {
    
    const { role } = req.params;

    try {
        
        if(!role) return res.status(501).send({ error: "Invalid role"});

        UserModel.findOne({ role }, function(err, user){
            if(err) return res.status(500).send({ err });
            if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        })

    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
    }

}


module.exports = {
    verifyUser,
    register,
    login,
    getUser,
    updateUser,
    generateOTP,
    verifyOTP,
    createResetSession,
    resetPassword,
    getUsers,
    updateUsers,
    deleteUser,
    getU
  };