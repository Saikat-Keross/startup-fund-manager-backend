import { DocumentDefinition } from 'mongoose';
import CampaignDetail_Q_A, {CampaignDetailQuestionsAnswerDocument} from '../../models/CampaignDetail/questions_answers.model';

interface postReplyProps{
    authorId: string,
    reply:{
        userId: string;
        replyComment: string;
        userPic: string;
        userName: string;
        userRole: string;
        replyDate: string;
    }
    
}

export async function postComment(doc: DocumentDefinition<CampaignDetailQuestionsAnswerDocument>){
    try{
       const posts = await CampaignDetail_Q_A.create(doc);

       return posts;
    }
    catch(error){
        console.log('An error occurred in [postComment] questions_answers.service.ts');
        
        if (error instanceof Error) {
            console.log(`Error message: ${error.message}`);
        }

        return false;
    }
}

export async function postReply(data: postReplyProps){
    console.log("Inside postReply");
    console.log(data);
    try{
        const updatedComment = await CampaignDetail_Q_A.findOneAndUpdate(
            {
                userId: data.authorId
            },
            {
               $push: {
                    reply: data.reply
                }
            },
            {
                new: true
            }
        )

        return updatedComment;
    }
    catch(error){
        console.log('An error occurred in [postReply] questions_answers.service.ts');
        
        if (error instanceof Error) {
            console.log(`Error message: ${error.message}`);
        }

        return false;
    }
}

export async function getAllComments(){
    console.log('Inside getAllComments');
    try{
        const comments = await CampaignDetail_Q_A.find({});

        //console.log(comments);
        return comments;
    }
    catch(error){
        console.log('An error occurred in [getAllComments] questions_answers.service.ts');
        
        if (error instanceof Error) {
            console.log(`Error message: ${error.message}`);
        }

        return false;
    }
    
}
