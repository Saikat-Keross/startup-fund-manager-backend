import { Request, Response } from 'express';
import { postComment, getAllComments } from '../../service/CampaignDetail/questions_answers.service';

export async function postCommentHandler(req: Request, res: Response){
    const data = req.body;

    try{
        const comment = await postComment(data);

        return comment;
    }
    catch(error){
        console.log('An error occurred in questions_answers.controller.ts');
        
        if (error instanceof Error) {
            console.log(`Error message: ${error.message}`);

            res.status(500).json({
                status: "error",
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
        else{
            res.status(500).json({
                status: "error",
                message: error,
                timestamp: new Date().toISOString()
            });
        }

        return false;
        
    }
}

export async function getAllCommentsHandler(req: Request, res:Response){
    console.log('Inside getAllCommentsHandler');
    try{
        const comment = await getAllComments();
        console.log('All comments: ', comment);

        res.status(200).json(comment);
    }
    catch(error){
        if (error instanceof Error) {
            res.status(500).json({
                status: "error",
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
        else{
            res.status(500).json({
                status: "error",
                message: error,
                timestamp: new Date().toISOString()
            });
        }
    }
}