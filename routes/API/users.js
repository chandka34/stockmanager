const express = require("express");
let router = express.Router();
var bcrypt = require('bcryptjs');
const _ = require('lodash');
const config =require('config');    
let { user } = require("../../models/users");
var jwt = require('jsonwebtoken');
var auth = require('../../middlewares/auth')
const validateusers = require('../../middlewares/validateUser')
const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: config.get('MAILGUN_APIKEY'), domain: config.get('Domain')}); 

//login//

router.post("/login", async (req, res) => { 
    try{
    let users = await user.findOne({ email: req.body.email });
  if (!users) return res.status(400).send({ message:"User with given Email does not exist"}); 
  let valid = await bcrypt.compare(req.body.password,users.password);
  if (!valid) return res.status(400).json({ message:'Invalid User or Password'});
  let token=jwt.sign(
    ({_id: users._id, email:users.email, role:users.role}),
    config.get('jwtPrivateKey')
  );
  
  return res.json({ message: 'Login Successfull',token});
} 
catch(err){
  return res.status(400).json({ message: 'Login Successfull' });
    }

});



//register//


router.post('/register',validateusers, async(req, res)=>
{
   
   try{
    var Users = await user.findOne({email : req.body.email});
    if (Users) return res.status(400).send("User with given Email already exist");
    let users= new user();
    users.firstname= req.body.firstname,
    users.lastname= req.body.lastname,
    users.username = req.body.username;
    users.email = req.body.email;
    users.password = req.body.password;  
    await users.generateHashedPassword();
    if(req.body.confirmpassword=='')  return res.status(400).send("please confirm password");
    if(req.body.password!=req.body.confirmpassword) return res.status(400).send("password does not match");
    users.address = req.body.address;
    users.contact = req.body.contact;
    
      
    let token=jwt.sign(
        ({firstname:users.firstname, lastname:users.lastname, username:users.username, email:users.email, password:users.password, address:users.address, contact:users.contact, role:users.role}),
        config.get('jwtPrivateKey'),{expiresIn:'20m'}
      );
             
const url =`http://localhost:3000/activation/${token}`
    const data = {
      from:'noreply@stockmanager.com',
      to: req.body.email,
      subject: 'Account activation',
     html:`
            <h2>Click on the link to activate your account</h2>    
            <a href="${url}">${url}</a>
     `
    };
   
    mg.messages().send(data, function (error, body) {
     if(error){
       return res.json({
         error: error.message
       })
     }
     return res.json({message:'Email activation code is sent to your email. Kindly check your email',token})
    });
     
 
  }
catch{
    return res.json({message:'Something Went Wrong Please Try Again'})
}


});
   
router.post('/ActivateAccount', async(req, res)=>
{
  
  try{
    const {token}= req.body;
    jwt.verify(token, config.get('jwtPrivateKey'), function(err, decodedToken) {
        if(err){
            return res.status(400).send('Incorrect or Expired Link');
        }
        const {firstname,lastname,username,email,password,address,contact,role}= decodedToken;
        console.log(decodedToken);
         user.findOne({email}).exec((err, User) => {

         if (User)
         { 
             return res.status(400).send("User with given Email already exist"); 
         }
  let newUser= new user({firstname,lastname,username,email,password,address,contact,role});
   newUser.save();
   return res.send('Your account is acctivated');

});
    });
  }

  catch(err)
    {
      return res.status(400).send({ message: 'Unsuccessfull activation' })
    }
});


module.exports= router;