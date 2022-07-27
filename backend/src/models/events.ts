import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    attendees: [{
        type: mongoose.Types.ObjectId, 
        required: true, 
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Message'
    }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref:'Users'
    }
})

export const Event = mongoose.model('Event', eventSchema);