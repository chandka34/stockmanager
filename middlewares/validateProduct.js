const { validate } = require('../models/products');
function validateProduct(req, res, next){
    let{ error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        next(); 
}
module.exports= validateProduct;