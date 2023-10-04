const Product = require('../models/productModel')

// add product
exports.addProduct = async (req, res) => {
    if(!req.file){
        return res.status(400).json({error:"Product image is required"})
    }
    let product = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        image: req.file?.path,
        count_in_stock: req.body.count_in_stock
    })
    product = await product.save()
    if (!product) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(product)
}

// get all products
exports.getAllProducts = async (req, res) => {
    let products = await Product.find().populate('category', 'category_name')
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    else {
        res.send(products)
    }
}

// get product details
exports.getProductDetails = async (req, res) => {
    // console.log(req.params)
    let product = await Product.findById(req.params.id).populate('category', 'category_name')
    if (!product) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(product)
}

// to update product
exports.updateProduct = async(req, res) => {
    let product = await Product.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        image: req.file?.path,
        count_in_stock: req.body.count_in_stock,
        rating: req.body.rating
    }, {new:true})
    if (!product) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(product)
}

// let product = await Product.findById(req.params.id)
// product.title = req.body.title ? req.body.title: product.title
// product.description = req.body.description
// product.rating = req.body.rating
// product.price = req.body.price
// product.category = req.body.category

// product = product.save()

// delete product
exports.deleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.params.id)
    .then(product=>{
        if(!product){
            return res.status(400).json({error:"Product not found"})
        }
        else{
            return res.send({"message":"Product deleted successfully"})
        }
    })
    .catch(error=> res.status(400).json({error:error.message}))
}

// to find products of a particular category
exports.productByCategory = async (req, res)=> {
    let products = await Product.find({
        category: req.params.categoryId
    }).populate('category','category_name')
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)   
}