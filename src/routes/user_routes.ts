import express from 'express';
//import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controller/user.controller';
import { UserController } from '../controller/user.controller';

const router = express.Router();
const userController = new UserController();

// Get all users
// Middleware to log access to all routes
router.use((req: { method: any; originalUrl: any; }, res: any, next: () => void) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

router.get('/users', userController.getAllUsers);

// Get user by ID
router.get('/users/:id', userController.getUser);

// Create a new user
router.post('/users', userController.createUser);

// Update an existing user
router.put('/users/:id', userController.updateUser);

// Delete a user
router.delete('/users/:id', userController.deleteUser);

export default router;