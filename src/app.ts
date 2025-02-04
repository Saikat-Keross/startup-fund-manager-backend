require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
import bodyParser from 'body-parser';
const cors = require('cors');
import connect from './utils/connect';
import logger from './utils/logger';
import routes from './routes';
import authRoutes from './routes/authRoutes';
import user_routes from "./routes/user_routes";
import admin_routes from "./routes/admin_routes";
import kyc_routes from "./routes/kyc.routes";

import { createDefaultAdmin } from './controller/createAdminUser';
import path from 'path';

const googleAuthRouter = require('./auth/google.route');

const session = require('express-session');
const passport = require('passport');
require('./config/passport.config')(passport); // This loads the passport configuration



const app = express()

app.use(cookieParser());

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
//const CLIENT_ORIGIN ='http://localhost:3000';
// console.log("googleAuthrouter",googleAuthRouter)
// console.log("authRoutes",authRoutes)
console.log("client origin",CLIENT_ORIGIN);


app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true })); //to parse formdata

 const corsOptions = {
  exposedHeaders: 'x-stripe-onboarding',
  origin: [CLIENT_ORIGIN],
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
app.use(session({
  secret: 'secret', 
  resave: false,
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/oauth',googleAuthRouter);

app.listen(port, async () => {
  logger.info(`App is running in port ${port}`);

  await connect();

  createDefaultAdmin();
  ///
  
  routes(app);
  // app.get("/", (req, res) => {
  //   res.send("<a href='/auth/google'>Login with Google</a>");
  // });
  app.use('/auth', authRoutes);

  app.use("/user",user_routes);

  app.use("/admin",admin_routes);

  app.use("/kyc",kyc_routes);
  //app.use("/profile",user_profile);
});
