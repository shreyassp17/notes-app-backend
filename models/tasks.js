const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String
    },
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)