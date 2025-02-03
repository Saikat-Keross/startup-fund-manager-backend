import { Request, Response } from 'express';
import { createUser,getUserById,updateUser,deleteUser, getAllUsers, getAllRoleRequests, getRoleRequest } from '../service/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import User from '../models/user.model';
import dispute from '../models/dispute.model';

import multer from 'multer';
import fs from 'fs';


const secretKey = process.env.JWT_SECRET;

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

    public async getUserByJWT(req: Request, res: Response): Promise<void> {
        try {
            //const user = await getUserById(req.user.id);
            console.log("Inside getUserByJWT");
            if(req.cookies.token){
                const token = req.cookies.token;
                console.log("token",token);
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log("decoded",decoded);
                const user = await getUserById(decoded.id);
                let userPrincipal = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    country: user.country,
                }
                console.log("userPrincipal",userPrincipal);
                if (user) {
                    res.status(200).json(userPrincipal);
                }
                else {
                    res.status(201).json({ message: 'User not found' });
                }
            }
            else {
                res.status(201).json({ message: 'User not found' });
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
        console.log("inside all users");
        try {
            const users = await getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getRoleRequests(req: Request, res: Response): Promise<void> {
        console.log("inside role requests");
        try {
            const users = await getAllRoleRequests();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getRoleRequest(req: Request, res: Response): Promise<void> {
        console.log("inside role request");
        try {
            const token = req.cookies.token;
            console.log("token",token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decoded",decoded);
            //const role = await getRoleRequest(decoded.id);
            const roleObj = await getRoleRequest(req.params.id);
            res.status(200).json(roleObj);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async geRolesForCurrentUser(req: Request, res: Response): Promise<void>{
        try{
            const token = req.cookies.token;
            const decoded = jwt.verify(token, secretKey as string);
            const user = await User.findOne({ _id : decoded.id });
            const role = user.role;
            res.status(200).send({role : role});
        }
        catch(e){
            console.log(e);
             res.status(500).send({
                error : 'Internal Server Error',
            })
        }
    }

    // ...existing code...
    public async submitDispute(req: Request, res: Response): Promise<void> {
        console.log(req.body)
       const {disputeId,disputeType,description,desiredOutcome,campaignName,campaignId} = req.body
        try {
           
                await dispute.create({ 
                disputeId: disputeId,
                rasiedBy: req.user?._id || "BACKER",  
                disputeType:disputeType,
                description: description,
                desiredOutcome:desiredOutcome,
                campaignName:campaignName,
                campaignId:campaignId,
                createdAt: Date.now(),
                resolvedAt: null,
                resolvedBy: null,
                comments: null,
            });
            console.log('success')
            res.status(201).send({ message: 'Dispute submitted successfully' });
        } catch (error) {
            console.log('error: '+(error as Error).message)
            res.status(500).send({ error: (error as Error).message });
        }
    }
    
    // public async createDirectory(req : Request, res: Response,next:Function):Promise<void>{
    //     console.log("while creating directory :" )
    //     console.log(req.body)
    //     const disputeid = uuidv4(); 
        
    //     //const path = `./uploads/dispute-evidences/evidences-${disputeid}`;
        
    //     // await new Promise((resolve, reject) => {
    //     //     fs.mkdir(path, { recursive: true }, (err) => {
    //     //         if (err) {
    //     //             reject(`Error creating directory: ${err.message}`);
    //     //         } else {
    //     //             console.log('Directory created successfully!');

    //     //             resolve(true);
    //     //         }
    //     //     });
    //     // });
        
    //     req.body.disputeId = disputeid

    //     //console.log(req.body)
        
    //     next();
    // }
    public async submitCreatorResponse(req:Request,res:Response,next:Function): Promise<void>{
        const _disputeId = req.params.id
        //console.log(req.body)
        // const responses = req.query.responses
        console.log(req.creatorResponse)
        await dispute.updateOne({disputeId:_disputeId},{ $set: {creatorResponse:req.creatorResponse} })
        res.status(500).json({message:"Creator response Submitted."})
    }
    
// ...existing code...
}


