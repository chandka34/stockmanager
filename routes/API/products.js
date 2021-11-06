var express = require('express');
var router = express.Router();
var validateProduct= require('../../middlewares/validateProduct');
var { product }= require('../../models/products')
var auth = require('../../middlewares/auth')
var owner = require('../../middlewares/owner')


/* Get All Products */
router.get('/', auth, owner, async function(req, res) {
    console.log(req.user);
    let products = await product.find();
    
  return res.send(products);
});



/* Get Single Product */
router.get('/:id',async function(req, res) {
    
    try
    {
        let Product = await product.findById(req.params.id);
        if(!Product)  return res.status(400).send('Product with given Id does not exists')
            console.log(Product)
            return res.send(Product);
    }
    catch (err){
        return res.status(400).send('Invalid ID')
    }
});

/* Update Product */
router.put("/:id",validateProduct,async function(req, res){
    try
    {
        let Product = await product.findById(req.params.id);
        if(!Product)  return res.status(400).send('Product with given Id does not exists')
          Product.name = req.body.name;
          Product.type = req.body.type;
          Product.code = req.body.code;  
          await Product.save();
          return res.send(Product);
    }
    catch (err){
        return res.status(400).send('Invalid ID')
    }
})

/* insert Product */
router.post("/",validateProduct, async function(req, res){
        
        let Product = new product();
          Product.name = req.body.name;
          Product.type = req.body.type;
          Product.code = req.body.code;  
          await Product.save();
          return res.send(Product);
    
})

/* Delete Product */
router.delete("/:id",async function(req, res){
    try
    {
        let Product = await product.findByIdAndDelete(req.params.id);
        if(!Product)  return res.status(400).send('Product with given Id does not exists')
          return res.send(Product);
    }
    catch (err){
        return res.status(400).send('Invalid ID')
    }
})

module.exports = router;
