import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    event: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    date: {
        type: String,
        required: true,
    }
})

export const Message = mongoose.model('Message', messageSchema);