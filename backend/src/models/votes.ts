import mongoose from "mongoose";

const votesSchema = new mongoose.Schema({
    poll: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Poll',
    },
    option: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString(),
    },
})

export const Vote = mongoose.model('Vote', votesSchema);