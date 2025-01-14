require('dotenv').config();
const express = require('express');
const cors = require('cors');
import connect from './utils/connect';
import logger from './utils/logger';
import routes from './routes';
import authRoutes from './routes/authRoutes';

const googleAuthRouter = require('./auth/google.route');

const session = require('express-session');
const passport = require('passport');
require('./config/passport.config')(passport); // This loads the passport configuration



const app = express();

// console.log("googleAuthrouter",googleAuthRouter)
// console.log("authRoutes",authRoutes)

app.use(express.json());
const corsOptions = {
  exposedHeaders: 'x-stripe-onboarding',
};
app.use(cors(corsOptions));
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

  //await connect();

  routes(app);
  // app.get("/", (req, res) => {
  //   res.send("<a href='/auth/google'>Login with Google</a>");
  // });
  app.use('/auth', authRoutes);
  
});
