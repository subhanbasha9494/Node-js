const jwt = require("jsonwebtoken");
const User = require("../models/user");

 const adminAuth =  (req,res,next) => {
   const token = "xyzuiuui";
   const isAuthorized = token === 'xyzuiuui';
   if(!isAuthorized){
    res.status(401).send({message: "Unauthorized"})
   }else{
    next();
   }
};

const userAuth = async (req, res, next) => {
  //Read the token from the req cookies
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login"); // If token is not present, send an error response
    }
    const decodeObj = await jwt.verify(token, "mysecret");
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
     req.user = user;
    next();
  } catch (err) {
    res.status(401).send("ERROR :" + err.message)
  }
  //Validate the token
  //Find the user
};

module.exports = {
  adminAuth,
  userAuth
}