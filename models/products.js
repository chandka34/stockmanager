var mongoose = require('mongoose');
 const joi = require('@hapi/joi');

var productSchema = mongoose.Schema({
    name: String,
    type: String,
    code: String
});
function validateProduct(data){
    const schema = joi.object({
        name: joi.string().min(2).max(10).required(),
        type: joi.string().min(2).max(10).required(),
        code: joi.string().min(2).max(10).required(),
    });
    return schema.validate(data, { abortEarly: false });
}
const Product = mongoose.model('Product', productSchema);

module.exports.product= Product;
module.exports.validate= validateProduct;
