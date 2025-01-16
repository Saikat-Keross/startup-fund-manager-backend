import express from 'express';

import { UserController } from '../controller/user.controller';
import { authenticateUser as loginUser ,logout as logoutUser, requestForRoleApproval, responseForRoleApproval } from '../controller/authenticateUser';
import { authUser, authAdminUser } from '../middleware/authUser';


const router = express.Router();
const userController = new UserController();

//user signup
router.post('/signup', userController.createUser);
//user login
router.post('/login', loginUser);
//user logout
router.post('/logout',authUser, logoutUser);

router.get("/me",authUser, userController.getUserByJWT);

router.get("/roles",authUser, userController.geRolesForCurrentUser);

router.post('/sendRequest',authUser, requestForRoleApproval);

router.post('/roleRequestResponse',authAdminUser,responseForRoleApproval);

export default router;