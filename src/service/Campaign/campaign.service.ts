import { DocumentDefinition } from "mongoose";
import Campaign, { CampaignDocument } from "../../models/Campaign/campaign.model";

export  async function postCampaign(doc: DocumentDefinition<CampaignDocument>){
    console.log('Inside postCampaign')

    try{
        const response = await Campaign.create(doc);

        return response;
    }
    catch(error){
        console.log('An error occurred in [postCampaign] campaign.service.ts');
        
        if (error instanceof Error) {
            console.log(`Error message: ${error.message}`);
        }

        return false;
    }
}