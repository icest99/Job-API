const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        require: [true, 'please provide company name'],
        maxlength: 50,
    },
    position: {
        type: String,
        require: [true, 'please provide company name'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        //tying job model to usermodel, by assign a user from user model
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
}, {timestamps: true})

module.exports = mongoose.model('Job', jobSchema)