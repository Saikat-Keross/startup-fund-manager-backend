import { DocumentDefinition } from "mongoose";
import Fundraiser, { FundraiserDocument } from '../../models/fundraiser.model';
//import Campaign, { CampaignDocument } from "../../models/Campaign/campaign.model";

export  async function postCampaign(doc: DocumentDefinition<FundraiserDocument>){
    console.log('Inside postCampaign')

    try{
        const response = await Fundraiser.create(doc);

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