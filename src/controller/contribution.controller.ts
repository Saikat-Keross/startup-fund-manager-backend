import { Request, Response } from 'express';
import logger from '../utils/logger';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { processContribution } from '../service/contribution.service';
import Fundraiser from '../models/fundraiser.model';

const dummyStripe = {
  charges: {
    create: async (data: any) => {
      return {
        id: 'ch_dummy123',
        amount: data.amount,
        currency: data.currency,
        source: data.source,
        description: data.description,
        status: 'succeeded',
      };
    },
  },
};

export async function processContributionHandler(req: Request, res: Response) {
  let fundraiser;
  let charge;

  console.log(req.body);
  // consider implementing 2 Phased Transactions
  // process stripe charge in pennies
  try {
    fundraiser = await Fundraiser.findById(req.body.fundraiserId);

    charge = await dummyStripe.charges.create({
      amount: req.body.amount * 100,
      currency: 'usd',
      description: fundraiser.title,
      statement_descriptor: process.env.COMPANY_NAME,
      on_behalf_of: fundraiser.stripeId,
      //source: req.body.token.id,
    });
    console.log(charge);
  } catch (ex: any) {
    logger.error(ex);
    res.status(400).send(ex.message);
  }

  try {
    let contribution;
    if (charge && charge.status === 'succeeded') contribution = await processContribution(req.body);

    // insert object into Fundraiser contribution
    fundraiser.contributions.push(contribution);

    // update Fundraiser current_amount total
    fundraiser.current_amount = fundraiser.current_amount + contribution.amount;

    fundraiser.save();

    return res.send(charge);
  } catch (ex: any) {
    logger.error(ex);
    res.status(400).send(ex.message);
  }
}
