const { validate } = require('../models/users');
function validateUser(req, res, next){
    let{ error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        next(); 
}
module.exports= validateUser;