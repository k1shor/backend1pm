const express = require('express')
const { addCategory } = require('../controller/categoryController')
const router = express.Router()

router.post('/addCategory',addCategory)

module.exports = router