require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
import connect from './utils/connect';
import logger from './utils/logger';
import routes from './routes';
import authRoutes from './routes/authRoutes';
import user_routes from "./routes/user_routes";
import { createDefaultAdmin } from './controller/createAdminUser';

const app = express();

app.use(cookieParser());

//const CLIENT_ORIGIN = 'http://192.168.2.164:3000';

app.use(express.json());
 const corsOptions = {
  exposedHeaders: 'x-stripe-onboarding',
  //origin: [CLIENT_ORIGIN],
  credentials: true,
};

/* const corsOptions = {
  origin: CLIENT_ORIGIN,
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  exposedHeaders: ['x-stripe-onboarding'], // Use an array for multiple headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}; */

app.use(cors(corsOptions));
//app.options('*', cors(corsOptions));
//console.log(process.env);

const port = process.env.PORT || 8000;



app.listen(port, async () => {
  logger.info(`App is running in port ${port}`);

  await connect();

  createDefaultAdmin();

  routes(app);
  app.use('/auth', authRoutes);
  app.use("/user",user_routes);
  //app.use("/profile",user_profile);

});
