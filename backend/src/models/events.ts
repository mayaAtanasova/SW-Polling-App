import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
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
    voted: [{   // voted users
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    polls: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Poll'
    }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString(),
    }
})

export const Event = mongoose.model('Event', eventSchema);