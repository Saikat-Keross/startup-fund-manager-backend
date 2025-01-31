import mongoose from 'mongoose';

export interface CampaignDetailQuestionsAnswerDocument extends mongoose.Document {
  userId: string;
  comment: string;
  commentDate: Date;
  reply: {
    userId: string;
    replyComment: string;
    replyDate: Date;
  }[]
}

const replySchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    replyComment: {
      type: String,
      required: true
    },
    replyDate: {
      type: Date,
      required: true
    }
  });
  
  export const CampaignDetail_Q_ASchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    commentDate: {
      type: Date,
      required: true
    },
    reply: [replySchema] // Define reply as an array of replySchema
  });


const CampaignDetail_Q_A = mongoose.model<CampaignDetailQuestionsAnswerDocument>('CampaignDetail_Q_A', CampaignDetail_Q_ASchema);

export default CampaignDetail_Q_A;