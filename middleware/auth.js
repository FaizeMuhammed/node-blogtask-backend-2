const jwt=require('jsonwebtoken')
const User=require('../models/User')

exports.protect=async(req,res,next)=>{
    try{
        console.log("vgcgcgcg",req.cookies);
        
        const token=req.cookies.token

        if(!token){
            return res.status(401).json({message:'Autharization failed No token'})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'User is blocked' });
        } 
        
        req.user = user;
        next();

    }
    catch(error){
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as an admin' });
    }
};