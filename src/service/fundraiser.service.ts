import { DocumentDefinition } from 'mongoose';
import Fundraiser, { FundraiserDocument } from '../models/fundraiser.model';

export async function createFundraiser(input: DocumentDefinition<FundraiserDocument>) {
  try {
    const fundraiser = await Fundraiser.create(input);
    return fundraiser;
  } catch (ex: any) {
    throw new Error(ex);
  }
}

export async function getFundraiserOne(params : any) {

  try {
    if (params) {
      const fundraiser = await Fundraiser.findOne(params);
      return fundraiser;
    }
    
    const fundraiser = await Fundraiser.findOne();
    return fundraiser;
  } catch (ex: any) {
    throw new Error(ex);
  }
}

export async function getFundraisers(params : any) {
  let fundraisers = null
  try {
    if (params) {
      console.log("inside if",params);
      fundraisers = await Fundraiser.find(params);
      //return fundraisers;
    }else{
      fundraisers = await Fundraiser.find();
    }
    
    console.log(`Fundraisers fro admin`,fundraisers)
    return fundraisers;
  } catch (ex: any) {
    throw new Error(ex);
  }
}

export async function getFundraiserById(id: string) {
  try {
    const fundraiser = await Fundraiser.findById(id);
    return fundraiser;
  } catch (ex: any) {
    throw new Error(ex);
  }
}

export async function postFaves(id: string) {
  try {
    const fundraiser = await Fundraiser.findById(id);

    fundraiser.faves = fundraiser.faves + 1;

    fundraiser.save();

    return fundraiser;
  } catch (ex: any) {
    throw new Error(ex);
  }
}

export async function updateFundraiser(id: string, input: DocumentDefinition<FundraiserDocument>) {
  try {
    const fundraiser = await Fundraiser.findById(id);

    fundraiser.title = input.title;
    fundraiser.story = input.story;
    fundraiser.image_url = input.image_url;
    fundraiser.category = input.category;
    fundraiser.goal_amount = input.goal_amount;

    fundraiser.save();
    return fundraiser;
  } catch (ex: any) {
    throw new Error(ex);
  }
}

export async function unpublishFundraiser(id: string) {
  try {
    const fundraiser = await Fundraiser.findById(id);

    fundraiser.published = !fundraiser.published;

    try {
    fundraiser.save();
    } catch (ex: any) {
      throw new Error(ex);
    }
    return fundraiser;
  } catch (ex: any) {
    throw new Error(ex);
  }
}

export async function publishFundraiser(id: string) {
  try {
    const fundraiser = await Fundraiser.findById(id);
    
    fundraiser.published = !fundraiser.published;
    fundraiser.approved = true;
    fundraiser.approvedOn = new Date();
    fundraiser.approvedBy = "admin";
    try {
    fundraiser.save();
    } catch (ex: any) {
      throw new Error(ex);
    }
    return fundraiser;
  }
  catch (ex: any) {
    throw new Error(ex);
  }
}

export async function deleteFundraiser(id: string) {
  try {
    await Fundraiser.findByIdAndDelete(id);

    return 'deleted';
  } catch (ex: any) {
    throw new Error(ex);
  }
}
