// Creating Token Model 
const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: "User" // references the user collection _id 
    },
    token: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date, 
        required: true
    },
    expiresAt: {
        type: Date, 
        required: true
    },
})

const Token = mongoose.model("Token", tokenSchema)
module.exports = Token;