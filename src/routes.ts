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
} from './controller/fundraiser.controller';
import { processContributionHandler } from './controller/contribution.controller';
import { createCheckoutSession } from './controller/stripe.checkout';
import { upload, handleFileUpload } from './controller/upload.controller';

const verifyPayment = require('./controller/verifyPayment.controller');

function routes(app: Express) {
  app.get('/test', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post('/api/fundraiser', validate(createFundraiserSchema), createFundraiserHandler);

  app.get('/api/fundraiser', getFundraisersHandler);

  app.get('/api/fundraiser/campaign/:id', getFundraiserByIdHandler);

  app.post('/api/fundraiser/campaign/faves/:id', postFavesHandler);

  app.post('/api/fundraiser/campaign/contribution', processContributionHandler);

  app.put('/api/fundraiser/campaign/:id', updateFundraiserHandler);

  app.patch('/api/fundraiser/campaign/:id', updateFundraiserHandler);

  app.delete('/api/fundraiser/campaign/:id', deleteFundraiserHandler);

  app.post('/api/fundraiser/campaign/checkout/:id', createCheckoutSession);

  app.get('/payment-check', verifyPayment);

  // File upload route
  app.post('/api/upload', upload.single('file'), handleFileUpload);
}

export default routes;
