const mongoose = require("mongoose");


const AdminSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    lastName: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
    sex: {
        type: String,
        require: true,
        trim: true
    },
    phone: {
        type: Number,
        require: true,
    },
    Age: {
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require: true,
    }
});


const Register = mongoose.model("Register",AdminSchema);

module.exports = Register;