import { Express, Request, Response } from 'express';
import validate from './middleware/validateResource';
import { createFundraiserSchema } from './schema/fundraiser.schema';
import {
  createFundraiserHandler,
  getFundraisersHandler,
  getFundraiserByIdHandler,
  postFavesHandler,
  updateFundraiserHandler,
  deleteFundraiserHandler,
  submitForApprovalHandler,
  getFundraisersHandlerForDashboard
} from './controller/fundraiser.controller';
import { processContributionHandler } from './controller/contribution.controller';
import { createCheckoutSession } from './controller/stripe.checkout';
import { upload, handleFileUpload, handleFileUploads } from './controller/upload.controller';
import path from 'path';

//const verifyPayment = require('./controller/verifyPayment.controller');

import verifyPayment from './controller/verifyPayment.controller';
import { authUserFromCookie } from './middleware/authUser'

import createCampaignRefund from './controller/refund.controller';

import getTransactionsByUserId from './controller/getTransaction.controller'
import getAllTransactions from './controller/allTransactions.controller';
import { createStripeAccount } from './controller/stripeAccount.controller';
import createOnboardingLink from './controller/stripeOnboard.controller';

// campaign detail
import { postCommentHandler, replyCommentHandler, getAllCommentsHandler } from './controller/CampaignDetail/questions_answers.controller';

// campaign
import { postCampaignHandler } from './controller/Campaign/campaign.controller';
import getRecomendedCampaignsTypesPreviouslyInvested from './controller/personalizedRecomendation.controller'

import { getLatestTransactions } from './controller/transaction.controller'

import { getLatestCampaigns, getHotCampaigns,willBeClosedCampaigns,raisedMostMoneylastweek } from './controller/campaignTypes.controller'


function routes(app: Express) {
  app.get('/test', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post('/api/fundraiser', validate(createFundraiserSchema), authUserFromCookie, createFundraiserHandler);

  app.get('/api/fundraiser', authUserFromCookie, getFundraisersHandler);

  app.get('/api/fundraiser/dashboard', authUserFromCookie, getFundraisersHandlerForDashboard);

  app.post('/api/fundraiser/submitForApproval', submitForApprovalHandler);

  app.get('/api/fundraiser/campaign/:id', getFundraiserByIdHandler);

  app.post('/api/fundraiser/campaign/faves/:id', postFavesHandler);

  app.post('/api/fundraiser/campaign/contribution', processContributionHandler);

  app.put('/api/fundraiser/campaign/:id', updateFundraiserHandler);

  app.patch('/api/fundraiser/campaign/:id', updateFundraiserHandler);

  app.delete('/api/fundraiser/campaign/:id', deleteFundraiserHandler);

  app.post('/api/fundraiser/campaign/checkout/:id', createCheckoutSession);

  // File upload route
  app.post('/api/upload', upload.single('file'), handleFileUpload);
  app.post('/api/uploadMultiple', upload.array('files', 10), handleFileUploads);

  // app.use((err, req, res, next) => {
  //   console.log('This is the invalid field ->', err.field);
  //   next(err);
  // });
  
  app.get('/payment-check',authUserFromCookie, verifyPayment);

  app.post('/api/refund/:campaignid', authUserFromCookie, createCampaignRefund)


  app.get('/api/transactions/user/:userId', getTransactionsByUserId);


  // app.get('/api/transactions',getAllTransactions)

  app.post('/api/payment/account/:campaignId', createStripeAccount)

  app.post('/api/account/onboard', createOnboardingLink)

  // campaign detail
  app.post('/api/QnA', postCommentHandler);
  app.post('/api/QnA/Reply', replyCommentHandler);
  app.get('/api/QnA', getAllCommentsHandler);

  // campaign
  app.post('/api/Campaign', postCampaignHandler);

  //Get Personalized campaigns recommendations
  app.get('/api/campaigns/recomendations', authUserFromCookie, getRecomendedCampaignsTypesPreviouslyInvested)


  //Get Latest Transactions
  app.get('/api/transactions', authUserFromCookie, getLatestTransactions)

  //Get Campaigns Types
  app.get('/api/campaigns/fresh', getLatestCampaigns)
  app.get('/api/campaigns/hot', getHotCampaigns)
  app.get('/api/campaigns/closing',willBeClosedCampaigns)
  app.get('/api/transactions/weeklyMoneyRaised', raisedMostMoneylastweek)

  app.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join('C:\\resources', filename));
  });
}

export default routes;


///api/campaigns/fresh?page=${page}&limit=${limit}`