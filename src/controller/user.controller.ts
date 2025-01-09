import { Request, Response } from 'express';
import { createUser,getUserById,updateUser,deleteUser, getAllUsers } from '../service/user.service';
import bcrypt from 'bcrypt';

export class UserController {
   /*  private userService: UserService;

    constructor() {
        this.userService = new UserService();
    } */

    public async createUser(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        const userBody = req.body;
        userBody.password = bcrypt.hashSync(userBody.password, 10);
        console.log(userBody);
        try {
            const user = await createUser(userBody);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await getUserById(req.params.id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await updateUser(req.params.id, req.body);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const success = await deleteUser(req.params.id);
            if (success) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}