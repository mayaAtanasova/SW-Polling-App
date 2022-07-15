import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    hashedp: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        required: false
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        ref: 'Role',
        required: true,
        default: 'user'},
    vpoints: {
        type: Number,
        required: true,
        default: 1,
    }
});

export const User = mongoose.model("User", userSchema);