import { DocumentDefinition } from 'mongoose';
import CampaignDetail_Q_A, {CampaignDetailQuestionsAnswerDocument} from '../../models/CampaignDetail/questions_answers.model';

export async function postComment(doc: DocumentDefinition<CampaignDetailQuestionsAnswerDocument>){
    try{
       const posts = await CampaignDetail_Q_A.create(doc);

       return posts;
    }
    catch(error){
        console.log('An error occurred in questions_answers.service.ts');
        
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
        console.log('An error occurred in questions_answers.service.ts');
        
        if (error instanceof Error) {
            console.log(`Error message: ${error.message}`);
        }

        return false;
    }
    
}