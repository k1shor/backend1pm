/*

Order : {
    item, quantity
    total
    shipping_address(street, city, postalcode, country)
    phone number
    contact person
    payment info
}
*/

const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderItemsSchema = new mongoose.Schema({
    product:{
        type: ObjectId,
        ref: "Product",
        required: true
    },
    quantity:{
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("OrderItems", orderItemsSchema)
