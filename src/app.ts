require('dotenv').config();
const express = require('express');
const cors = require('cors');
import connect from './utils/connect';
import logger from './utils/logger';
import routes from './routes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());
const corsOptions = {
  exposedHeaders: 'x-stripe-onboarding',
};
app.use(cors(corsOptions));
console.log(process.env);

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  logger.info(`App is running in port ${port}`);

  await connect();

  //routes(app);
  app.use('/auth', authRoutes);
});
