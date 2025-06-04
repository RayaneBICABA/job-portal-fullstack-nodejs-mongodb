const mongoose = require ('mongoose');

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true,"The title is required"],
        length: 250,
        trim: true
    },

    description:{
        type: String,
        required: [true,"The description is required"],
        trim: true,
        length: 500,
    },

    company:{
        type: String,
        trim: true,
        required: [true,"Ther company is required"]
    },

    location:{
        type: String,
        required: [true,"The location is required"],
        trim: true
    },

    salary:{
        type: Number,
        required: [true,"The salary is required"],
        trim: true,
    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true,"The user is required"]
    },

    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Job",jobSchema); 
