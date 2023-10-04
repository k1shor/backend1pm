const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: ObjectId,
        ref: "OrderItems",
        required: true
    }],
    total:{
        type: Number,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    contact_person: {
        type: String
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postal_code:{
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    payment_info:{
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model("Order",orderSchema)