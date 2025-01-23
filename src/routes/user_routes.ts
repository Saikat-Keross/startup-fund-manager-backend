import express from 'express';
//import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controller/user.controller';
import { UserController } from '../controller/user.controller';
import { authUser,authAdminUser } from '../middleware/authUser';

const router = express.Router();
const userController = new UserController();

// Get all users
// Middleware to log access to all routes
router.use((req: { method: any; originalUrl: any; }, res: any, next: () => void) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

router.get('/users',authAdminUser, userController.getAllUsers);

// Get user by ID
router.get('/users/:id',authAdminUser, userController.getUser);

// Create a new user
router.post('/users',authAdminUser, userController.createUser);

// Update an existing user
router.put('/users/:id',authAdminUser, userController.updateUser);

// Delete a user
router.delete('/users/:id',authAdminUser, userController.deleteUser);

router.post('/roleRequests',authAdminUser, userController.getRoleRequests);


router.post('/submitDispute',authUser,userController.submitDispute );

export default router;