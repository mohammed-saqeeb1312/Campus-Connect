const mongoose = require("mongoose");

const facultyShema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
        trim: true
    },

    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    phone:{
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    }
},{timestamps: true});


const Faculty = mongoose.model("Faculty" , facultyShema);

module.exports = Faculty;



