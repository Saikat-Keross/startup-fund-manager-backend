import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import  User from '../models/user.model'; // Adjust the path as necessary
import UserRole from '../models/userRole.model';
import { object } from 'zod';

const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

interface User {
    //userId: string;
    username: string;
    password: string;
}

// Dummy user for demonstration purposes
/* const dummyUser: User = {
    userId: '1',
    username: 'testuser',
    password: bcrypt.hashSync('password123', 10) // Hash the password
}; */

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        console.log("body => ",req.body);
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if the user exists and the password matches
        if (username === user.username && await bcrypt.compare(password, user.password)) {
            // Create a JWT token
            const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
            
            // Send the token as a cookie
            //res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' , path: '/',  sameSite : 'none' ,maxAge: 3600000 });
            res.cookie('token', token, { secure: true , sameSite: 'none',  path: '/', maxAge: 3600000 });
            
            // Send the token to the client
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey as string);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.send({ message: 'Logged out successfully' });
};

export const setUserRole = async (req: Request, res: Response) =>{
    const { role } = req.body;
    const jwtToken = req.cookies.token;
    const decoded = jwt.verify(jwtToken, secretKey as string);
    const user = await User.findOne({ _id: decoded.id });
    let roles = user.roles;
    if(!roles.includes(role)){
        roles.push(role);
        user.roles = roles;
        user.save()
    }
  
}

export const requestForRoleApproval = async (req: Request, res: Response) =>{
    const { role,field_of_interest,industry,kyc_document,document_upload,investmentFocus,investmentAmount } = req.body;
    console.log(req.body);
   
    try{
        //console.log(req);
        console.log(req.cookies);
        const jwtToken = req.cookies.token;
        const decoded = jwt.verify(jwtToken, secretKey as string);
        const userRoleStatus = await UserRole.findOne({userId : decoded.id , approvalStatus: { $ne: 'rejected' }  });
        if(userRoleStatus){
            if(userRoleStatus.approvalStatus == "pending"){
                return res.status(400).send({error : 'User already has a pending role request.'});
            }
            else{
                return res.status(400).send({error : 'User already has an approved role.'});
            }
        }
        const user = await User.findOne({ _id: decoded.id });
        let userRoleObject = {
            userId : decoded.id,
            role : role,
            field_of_interest : field_of_interest,
            industry : industry,
            kyc_document : kyc_document,
            document_upload : document_upload,
            investmentFocus : investmentFocus,
            investmentAmount : investmentAmount,
            approvalStatus : 'pending',
            requestedAt : new Date()
        }
        try{
            const userRole = await UserRole.create(userRoleObject);
            return res.status(201).send({
                message: 'Role request sent successfully',
            })
        }
        catch(e){
            console.log(e);
            return res.status(500).send({
                error: 'Internal Server Error',
                })
        }
     
    }
    catch(e){
        console.log(e);
        return res.status(500).send({
            error: 'Internal Server Error',
        })
    }
   

}

export const responseForRoleApproval = async (req : Request, res: Response) =>{
    const { id ,approvalStatus, comments  } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secretKey as string);
    const currentUserId = decoded.id;
    try{
        const user = await User.findOne({_id : currentUserId, roles: { $in: ['admin'] } });
        if(!user){
            return res.status(404).send({error : 'You are not authorized to take any action.'});
        }
        const userRole = await UserRole.findOne({userId : id, approvalStatus : 'pending' });

        if(!userRole){
            return res.status(404).send({error : 'No request found.'});
        }
        else{
            let targetRole = userRole.role;
            userRole.approvalStatus = approvalStatus;
            userRole.comments = comments;
            userRole.approvalDate = new Date();
            userRole.approvedBy = currentUserId;
            try {
                userRole.save();
            }
            catch(e){
                console.log(e);
                return res.status(500).send({
                    error: 'Internal Server Error',
                })
            }
           

            const targetUser = await User.findOne({_id : id});
            console.log(targetUser);
            let roles = targetUser.roles;
            console.log(roles);
            console.log(targetRole);
            if(!roles.includes(targetRole)){
                roles.push(targetRole);
                targetUser.roles = roles;
                targetUser.save()
            }
        }
        return res.status(200).send({message : 'Role approved successfully.'});
    }
    catch(e){
        console.log(e);
        return res.status(500).send({
            error : 'Internal Server Error',
        })
    }
}

