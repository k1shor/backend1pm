const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const crypto = require('crypto')
// const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "customer"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    salt: String
}, { timestamps: true })

userSchema.virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(this._password)
    })
    .get(function () {
        return this.hashed_password
    })

userSchema.methods = {
    encryptPassword : function(_password){
        if(_password == null){
            return null
        }
        else{
            return _password = crypto.createHmac('sha256',this.salt).update(_password).digest('hex')
        }
    },
    authenticate: function(_password){
        return this.hashed_password === this.encryptPassword(_password)
    } 
}    

module.exports = mongoose.model("User", userSchema)