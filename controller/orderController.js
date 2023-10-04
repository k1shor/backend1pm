const OrderItems = require('../models/orderItemsModel')
const Order = require('../models/orderModel')


// place order
exports.placeOrder = async (req, res) => {
    // store order items in OrderItemsModel
    let orderItemsIds = await Promise.all(
        req.body.orderItems.map(async (orderItem) => {
            let orderItems = await OrderItems.create({
                product: orderItem.product,
                quantity: orderItem.quantity
            })
            if (!orderItems) {
                return res.status(400).json({ error: "Something went wrong" })
            }
            return orderItems._id
        })
    )
    // calculate total 
    // calculate individual totals
    let individual_totals = await Promise.all(
        orderItemsIds.map(async orderItem => {
            let order_item = await OrderItems.findById(orderItem).populate('product', 'price')
            return order_item.product.price * order_item.quantity
        })
    )
    let total = individual_totals.reduce((acc, cur) => acc + cur)
    let order = await Order.create({
        orderItems: orderItemsIds,
        total: total,
        user: req.body.user,
        contact_person: req.body.contact_person,
        street: req.body.street,
        city: req.body.city,
        postal_code: req.body.postal_code,
        state: req.body.state,
        country: req.body.country,
        phone: req.body.phone_number
    })
    if (!order) {
        return res.status(400).json({ error: "Failed to place order" })
    }
    res.send(order)
}

/*
orderitems - laptop - 5: _laptop
orderitems - samsung mobile - 4: _samsung
orderitems - samsung mobile - 4: _samsung2


order: {
    orderItems: [_laptop, _samsung, _samsung2],
    total: 
}
*/

/*
to get orders list */
exports.getAllOrders = async (req, res) => {
    let orders = await Order.find().populate('user', 'username')
        .populate({ path: 'orderItems', populate: ({ path: 'product', populate: ('category') }) })
    if (!orders) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orders)
}

// to get order details
exports.getOrderDetails = async (req, res) => {
    let order = await Order.findById(req.params.orderId)
        // .populate('user','username')
        .populate({ path: 'orderItems', populate: ({ path: 'product', populate: ('category') }) })
    if (!order) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(order)
}

// get order of a particular user
exports.getUserOrders = async (req, res) => {
    let orders = await Order.find({ user: req.params.userId }).populate('user', 'username')
        .populate({ path: 'orderItems', populate: ({ path: 'product', populate: ('category') }) })
    if (!orders) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orders)
}

// get order by status
exports.getOrdersByStatus = async (req, res) => {
    let orders = await Order.find({ status: req.query.status })
        .populate('user', 'username')
        .populate({ path: 'orderItems', populate: ({ path: 'product', populate: ('category') }) })
    if (!orders) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orders)
}

// update order status
exports.updateOrderStatus = async (req, res) => {
    let order = await Order.findByIdAndUpdate(req.params.orderId, {
        status: req.body.status
    }, { new: true })
    if (!order) {
        return res.status(400).json({ error: "Failed to update order status." })
    }
    res.send({ message: "Order status Updated" })
}

// delete or cancel order
exports.deleteOrder = (req, res) => {
    Order.findByIdAndRemove(req.params.id)
        .then(async order => {
            if (!order) {
                return res.status(400).json({ error: "Order not found" })
            }
            await Promise.all(
                order.orderItems.map(item => {
                    OrderItems.findByIdAndDelete(item)
                        .then(orderItem => {
                            if (!orderItem) {
                                return res.status(400).json({ error: "Order Item not found" })
                            }
                        })
                        .catch(error => {
                            return res.status(400).json({ error: error.message })
                        })
                })
            )
            res.send({message:"Order deleted successfully."})
        })
        .catch(error => {
            return res.status(400).json({ error: error.message })
        })
}