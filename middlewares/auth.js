const jwt = require('jsonwebtoken');
const config = require('config');
const Users = require('../models/users');
async function auth(req,res,next)
{
    let token= req.header('x-auth-token');
    if(!token) return res.status(400).send('token not provided');
  
    let user = jwt.verify(token,config.get('jwtPrivateKey'));
    
    req.user= user;      
    next();
}
module.exports=auth;