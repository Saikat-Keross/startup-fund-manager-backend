import express from 'express';

import { UserController } from '../controller/user.controller';
import { authenticateUser as loginUser ,logout as logoutUser, requestForRoleApproval, responseForRoleApproval } from '../controller/authenticateUser';
import { authUser, authAdminUser } from '../middleware/authUser';
import { getFundraiserRequestsHandler, approveFundraiserRequestHandler } from '../controller/fundraiser.controller';


const router = express.Router();
const userController = new UserController();



router.get('/users',authAdminUser, userController.getAllUsers);

router.get('/users/:id',authAdminUser, userController.getUser);

router.post('/users',authAdminUser, userController.createUser);

router.put('/users/:id',authAdminUser, userController.updateUser);

router.delete('/users/:id',authAdminUser, userController.deleteUser);

router.get('/roleRequests',authAdminUser, userController.getRoleRequests);
router.get('/roleRequests/:id',authAdminUser, userController.getRoleRequests);

router.post('/roleRequestResponse',authAdminUser,responseForRoleApproval);

router.get('/campaignRequests', authAdminUser,getFundraiserRequestsHandler);

//router.get('/campaignRequests/:id', authAdminUser,getFundraiserRequestsHandler);

//router.post('/request/campaignResponses/:id',authAdminUser,approveFundraiserRequestHandler);
router.post('/request/campaignResponses', authAdminUser, (req, res) => {
    const id = req.query.id;
    approveFundraiserRequestHandler(req, res);
  });
  

/* router.post('/campaignRequestResponses',authAdminUser,(req: { body: any; }, res: any) => {
    res.status(400).send({message: "Please provide a valid campaign id"});
}) */


export default router;