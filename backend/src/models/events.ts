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
    },
    editedAt: {
        type: Date,
        default: new Date().toISOString(),
    },
    archived: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    }
})

export const Event = mongoose.model('Event', eventSchema);