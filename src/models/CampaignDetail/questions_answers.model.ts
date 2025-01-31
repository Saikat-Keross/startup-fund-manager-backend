import mongoose from 'mongoose';

export interface CampaignDetailQuestionsAnswerDocument extends mongoose.Document {
  userId: string;
  userName: string,
  userPic: string,
  userRole: string,
  comment: string;
  commentDate: string;
  reply: {
    userId: string;
    userName: string,
    userPic: string,
    userRole: string,
    replyComment: string;
    replyDate: string;
  }[]
}

const replySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userPic: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    replyComment: {
        type: String,
        required: true
    },
    replyDate: {
        type: String,
        required: true
    }
});
  
const CampaignDetail_Q_ASchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userPic: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    commentDate: {
        type: String,
        required: true
    },
    reply: [replySchema] // Define reply as an array of replySchema
});

const CampaignDetail_Q_A = mongoose.model<CampaignDetailQuestionsAnswerDocument>('CampaignDetail_Q_A', CampaignDetail_Q_ASchema);

export default CampaignDetail_Q_A;