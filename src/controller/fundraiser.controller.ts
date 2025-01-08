import { Request, Response } from 'express';
import logger from '../utils/logger';
import {
  createFundraiser,
  getFundraisers,
  getFundraiserById,
  postFaves,
  updateFundraiser,
  unpublishFundraiser,
  deleteFundraiser,
} from '../service/fundraiser.service';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Dummy Stripe object
const dummyStripe = {
  accounts: {
    create: async (data: any) => {
      return {
        id: 'acct_dummy123',
        email: data.email,
        type: data.type,
        country: data.country,
        business_type: data.business_type,
        individual: data.individual,
        tos_acceptance: data.tos_acceptance,
      };
    },
  },
  accountLinks: {
    create: async (data: any) => {
      return {
        object: 'account_link',
        url: 'https://dummy.stripe.com/account_link',
        created: Math.floor(Date.now() / 1000),
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        type: data.type,
        account: data.account,
      };
    },
  },
};

export async function createFundraiserHandler(req: Request, res: Response) {
  // consider implementing 2 Phased Transactions

  let stripeAccount;

  // First create user account on Stripe to store ID on our Fundraiser document
  try {
    const account = await dummyStripe.accounts.create({
      type: 'express',
      country: 'US',
      email: req.body.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    stripeAccount = account;
  } catch (ex: any) {
    logger.error(ex.message);
    res.status(400).send(ex.message);
  }

  // Destructure client request object to set stripeId

  if (!stripeAccount) {
    return res.status(400).send('Failed to create Stripe account');
  }
  const stripeFundraiser = { ...req.body, stripeId: stripeAccount.id };

  // Create our Fundraiser
  try {
    let fundraiser = await createFundraiser(stripeFundraiser);

    // Create Stripe onboarding account link, send as a header in response
    let baseUrl = process.env.REACT_APP_URL;
    let accountLinkData = {
      account: stripeAccount.id,
      refresh_url: baseUrl,
      return_url: baseUrl + `/campaign/${fundraiser._id}`,
      type: 'account_onboarding',
    };
    const accountLink = await dummyStripe.accountLinks.create(accountLinkData);

    return res.header('x-stripe-onboarding', accountLink.url).send(fundraiser);
  } catch (ex: any) {
    logger.error(ex);
    res.status(400).send(ex.message);
  }
}

export async function getFundraisersHandler(req: Request, res: Response) {
  try {
    let fundraisers = await getFundraisers();
    return res.send(fundraisers);
  } catch (ex: any) {
    logger.error(ex);
    res.status(400).send(ex.message);
  }
}

export async function getFundraiserByIdHandler(req: Request, res: Response) {
  let { id } = req.params;

  try {
    let fundraiser = await getFundraiserById(id);
    return res.send(fundraiser);
  } catch (ex: any) {
    logger.error(ex);
    res.status(400).send(ex.message);
  }
}

export async function postFavesHandler(req: Request, res: Response) {
  let { id } = req.params;

  try {
    let fundraiser = await postFaves(id);
    return res.send(fundraiser);
  } catch (ex: any) {
    logger.error(ex);
    res.status(400).send(ex.messages);
  }
}

export async function updateFundraiserHandler(req: Request, res: Response) {
  let { id } = req.params;

  try {
    let fundraiser = await updateFundraiser(id, req.body);
    return res.send(fundraiser);
  } catch (ex: any) {
    logger.error(ex);
    res.status(400).send(ex.message);
  }
}

export async function unpublishFundraiserHandler(req: Request, res: Response) {
  let { id } = req.params;
  try {
    let fundraiser = await unpublishFundraiser(id);
    return res.send(fundraiser);
  } catch (ex: any) {
    logger.error(ex);
    res.status(400).send(ex.message);
  }
}

export async function deleteFundraiserHandler(req: Request, res: Response) {
  let { id } = req.params;
  try {
    await deleteFundraiser(id);
    return res.send('deleted');
  } catch (ex: any) {
    logger.error(ex);
    res.status(400).send(ex.message);
  }
}
