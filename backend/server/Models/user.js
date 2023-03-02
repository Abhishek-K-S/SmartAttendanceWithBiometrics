const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        required: [true, "Username cannot be empty"],
        type: String,
        minlength: [1, "Username cannot be empty"]
    },
    employeeID: {
        required: [true, "Employee id is required"],
        type: String,
        minlength: [1, "Employee id is required"],
        unique: [true, "Employee already registered.. Please do login"]
    },
    latitude: {
        required: [true, "Location is required"], 
        // type: mongoose.Types.Decimal128
        type: Number
    },
    longitude: {
        required: [true, "Location is required"], 
        // type: mongoose.Types.Decimal128
        type: Number
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User