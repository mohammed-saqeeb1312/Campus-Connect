
const mongoose = require("mongoose");

// Student ke liye Schema create kar rahe hain
const studentSchema = new mongoose.Schema({

    // Student ka name
    name: {
        type: String,       // Name string format mein hoga
        required: true,     // Name compulsory hai
        trim: true          // Starting aur ending spaces remove karega
    },

    // Student ka email
    email: {
        type: String,       
        required: true,     
        unique: true,       
        lowercase: true     
    },

    // Student ka phone number
    phone: {
        type: String,       
        required: true      
    },

    // Student ka department
    department: {
        type: String,       
        required: true      
    },

    // Student ka academic year
    year: {
        type: String,      
        required: true      
    }

}, { timestamps: true });   // Automatically createdAt aur updatedAt add honge 
                           // tabhi bhi hum kuch chnages karinge to automatic ye bhi change ya update hoga.

// Student model create kar rahe hain isme
const Student = mongoose.model("Student", studentSchema);

// Model ko export kar rahe hain
//  TAAKI YHAN SE controller mein use kar sakein
module.exports = Student;
