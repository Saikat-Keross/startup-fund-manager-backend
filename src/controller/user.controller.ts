import { Request, Response } from 'express';
import { createUser,getUserById,updateUser,deleteUser, getAllUsers, getAllRoleRequests } from '../service/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import User from '../models/user.model';
import dispute from '../models/dispute.model';
import { v4 as uuidv4 } from 'uuid';
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
            const token = req.cookies.token;
            console.log("token",token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decoded",decoded);
            const user = await getUserById(decoded.id);
            let userPrincipal = {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles
            }
            console.log("userPrincipal",userPrincipal);
            if (user) {
                res.status(200).json(userPrincipal);
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

    public async geRolesForCurrentUser(req: Request, res: Response): Promise<void>{
        try{
            const token = req.cookies.token;
            const decoded = jwt.verify(token, secretKey as string);
            const user = await User.findOne({ _id : decoded.id });
            const roles = user.roles;
            res.status(200).send({roles : roles});
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
        try {
            if (!req.body.dispute) {
                res.status(400).send({ message: 'Dispute is required' });
                return ;
            }
            const { dispute } = req.body;
            
            const {resourceIds,dispputeid} = await this.uploadEvidence(req,res,()=>{});
            console.log("resourceIds",resourceIds);
                await dispute.create({ 
                disputeId: dispputeid,
                rasiedBy: req.user._id,  
                disputeType:dispute.disputeType,
                description: dispute.description,
                status: 'pending',
                evidences: resourceIds,
                createdAt: Date.now(),
                resolvedAt: null,
                resolvedBy: null,
                comments: null,
            });
            res.status(201).send({ message: 'Dispute submitted successfully' });
        } catch (error) {
            res.status(500).send({ error: (error as Error).message });
        }
    }
    public async uploadEvidence(req : Request, res: Response,next:Function): Promise<{resourceIds: string[], dispputeid: string}>{
        //uploaded files
        const resourceIds: void | string[] | PromiseLike<void> = []
        const dispputeid = uuidv4(); 
        //creating evidence-paths
        const path = `./dispute-evidences/dispute_evidence${dispputeid}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          //end creatinbg evidence-paths
        const storage = multer.diskStorage({
            destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
              cb(null, path)
            },
            filename: function (req: any, file: { fieldname: string; }, cb: (arg0: null, arg1: string) => void) {
              const uniqueSuffix = uuidv4();
              resourceIds.push(uniqueSuffix) //pushing resoiurce ids
              cb(null, file.fieldname + '-' + uniqueSuffix)
            }
          })
          
          const upload = multer({ storage: storage })
            await upload.array('evidence', 10);
          return {resourceIds,dispputeid};
          //end uploaded files
    }
// ...existing code...
}


