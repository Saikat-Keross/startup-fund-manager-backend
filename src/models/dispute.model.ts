import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
    disputeId: {    
        type: String,
        required: true,
    },
    rasiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    disputeType: {
        type: String,
        enum: ['fraud', 'misrepresentation', 'other'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending',
    },
    evidences: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resolvedAt: {
        type: Date,
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: {
        type: String,
    },
});

const dispute = mongoose.model('dispute', disputeSchema);

export default dispute;
