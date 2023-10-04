const express = require('express')
const { placeOrder, getAllOrders, getOrderDetails, getUserOrders, getOrdersByStatus, updateOrderStatus, deleteOrder } = require('../controller/orderController')
const router = express.Router()

router.post('/placeorder', placeOrder)
router.get('/getallorders', getAllOrders)
router.get('/getorderdetails/:orderId', getOrderDetails)
router.get('/getuserorders/:userId', getUserOrders)
router.get('/getorderbystatus', getOrdersByStatus)
router.put('/updateorderstatus/:orderId', updateOrderStatus)
router.delete('/deleteorder/:id', deleteOrder)

module.exports = router