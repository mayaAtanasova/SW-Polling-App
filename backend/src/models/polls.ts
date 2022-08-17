import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
    type: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    event: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Event',
    },
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
    options: [{
        type: String,
        required: false,
    }],
    votes: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Vote'
    }],
    deleted: {
        type: Boolean,
        default: false,
    },
    concluded: {
        type: Boolean,
        default: false,
    }
})

export const Poll = mongoose.model('Poll', pollSchema);