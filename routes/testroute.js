const express = require('express')
const { testfunction } = require('../controller/testcontroller')
const router = express.Router()

// endpoints
router.get('/test', testfunction)

module.exports = router