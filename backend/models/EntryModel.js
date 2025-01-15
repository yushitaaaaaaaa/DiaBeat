const mongoose = require('mongoose')

const Schema = mongoose.Schema
const entrySchema = new Schema({

    timewhen: {
        type: String, 
        required:  true
    },
    bloodsugar: {
        type: Number, 
        required: true
    },
    insulin: {
        type: Number,
        required: true,
    },
    user_id:{
        type: String,
        required: true
    }
} ,{timestamps: true})

module.exports = mongoose.model('Entry', entrySchema)

//entrySchema.find()
