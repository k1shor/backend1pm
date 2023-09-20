// const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')

// const categorySchema = new Schema
const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    }
},{timestamps: true})

// module.exports = model("Category",categorySchema)
module.exports = mongoose.model("Category",categorySchema)

//  _id : provided by mongodb by default, 18 or 24 bits hex characters
// timestamps: createdAt, updatedAt provided by timestamps