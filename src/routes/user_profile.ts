import express from 'express';
import { UserController } from "../controller/user.controller";

const router = express.Router();

const userController = new UserController();


/* router.get('/profile', userController.getUserProfile);

router.put('/profile', userController.updateUserProfile);
 */
