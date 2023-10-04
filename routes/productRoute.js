const express = require('express')
const { addProduct, getAllProducts, getProductDetails, updateProduct, deleteProduct, productByCategory } = require('../controller/productController')
const upload = require('../utils/fileUpload')
const { productCheck, validate } = require('../validation/validation')
const router = express.Router()

router.post('/addproduct', upload.single('product_image'), productCheck, validate, addProduct)
router.get('/getallproducts', getAllProducts)
router.get('/getproductdetails/:id', getProductDetails)
router.put('/updateproduct/:id', updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)
router.get('/:categoryId', productByCategory)

module.exports = router