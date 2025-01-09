import express from 'express';

import { UserController } from '../controller/user.controller';
import { authenticateUser as loginUser ,logout as logoutUser } from '../controller/authenticateUser';

const router = express.Router();
const userController = new UserController();

//user signup
router.post('/signup', userController.createUser);
//user login
router.post('/login', loginUser);
//user logout
router.post('/logout', logoutUser);

export default router;