import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({

    disputeId: {    
        type: String,
        required: true,
    },
    rasiedBy: {
        type: String,//mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    disputeType: {
        type: String,
        enum: ['fraud', 'mis representation', 'scope disagreement','quality concerns','technical issues','other'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Under Review', 'Resolved'],
        default: 'Under Review',
    },
    desiredOutcome:{
        type:String,

    },
    campaignId:{
        type:String,
        required:true,
    },
    campaignName:{
        type:String,
        required:true,
    },
    // evidences: {
    //     type: [String],
    //     required: true,
    // },
    creatorResponse:{
        type:[Object],
        default:[],
        
    },
    adminQueries:{
        type:[Object],
        default:[],

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resolvedAt: {
        type: Date,
    },
    resolvedBy: {
        type: String,
        ref: 'User',
    },
    comments: {
        type: String,
    },
});

const dispute = mongoose.model('dispute', disputeSchema);

export default dispute;
