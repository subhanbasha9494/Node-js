 const adminAuth =  (req,res,next) => {
   const token = "xyzuiuui";
   const isAuthorized = token === 'xyzuiuui';
   if(!isAuthorized){
    res.status(401).send({message: "Unauthorized"})
   }else{
    next();
   }
};

 const userAuth =  (req,res,next) => {
   const token = "xyzuiuui";
   const isAuthorized = token === 'xyzuiuui';
   if(!isAuthorized){
    res.status(401).send({message: "Unauthorized"})
   }else{
    next();
   }
};

module.exports = {
    adminAuth,
    userAuth
}