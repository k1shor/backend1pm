const { check, validationResult } = require('express-validator')

exports.categoryCheck = [
    check('category_name', 'Category name is required').notEmpty()
        .isLength({ min: 3 }).withMessage('Category must be at least 3 characters')
        .matches(/^[a-zA-Z]+$/).withMessage('Category name must be only alphabets')
]

exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
        // res.status(400).json({error: errors.array().map(err=>err.msg)})
    }
    next()
}

exports.productCheck = [
    check('title', 'Product name is required').notEmpty()
        .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
    check('price', 'Product price is required').notEmpty()
        .isNumeric().withMessage('Price must be a number'),
    check('description', 'Description is required').notEmpty()
        .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    check('count_in_stock', 'Count in stock is required').notEmpty()
        .isNumeric().withMessage("count must be a number"),
    check('category', 'Category is required').notEmpty()
]

exports.userCheck = [
    check('username', 'Username is required').notEmpty()
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    check('email', 'E-mail is required').notEmpty()
        .isEmail().withMessage('Email format incorrect'),
    check('password', 'Password is required').notEmpty()
        .matches(/[a-z]/).withMessage("Password must consist of at least 1 lowercase alphabet")
        .matches(/[A-Z]/).withMessage("Password must consist of at least 1 uppercase alphabet")
        .matches(/[0-9]/).withMessage("Password must consist of at least 1 number")
        .matches(/[+\-*/!@#$%^&]/).withMessage("Password must consist of at least 1 special character (+\-*/!@#$%^&)")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
]