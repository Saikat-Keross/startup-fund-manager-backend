import { Request, Response } from "express";
import { postCampaign } from "../../service/Campaign/campaign.service";

export async function postCampaignHandler(req: Request, res: Response){
    console.log("Inside postCampaignHandler\n", req.body);
    
    if(req?.body){
        try{
            const response = await postCampaign(req.body);

            return response;
        }
        catch(error){
            console.log('An error occurred in campaign.controller.ts[postCampaignHandler]');
        
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
    
}