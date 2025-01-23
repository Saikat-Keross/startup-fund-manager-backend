import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const authUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
    const body = req.body;
    console.log("body =>",body);
    console.log("token =>",token);

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log(decoded.id);
        const user = await User.findOne({ _id: decoded.id });
        //const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(400).send({ error: 'Invalid token.' });
        }

        next();
    } catch (ex) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

//export default authUser;
const authUserFromCookie = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

const authAdminUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
       // let userId = decoded.id;
       console.log(decoded);
        let user = await User.findOne({ _id : decoded.id});
        console.log(user);
        if (!user) {
            return res.status(400).send({ error: 'Invalid token.' });
        }

        if (user.role !='admin') {
            return res.status(403).send({ error: 'Access denied.' });
        }
        console.log("user authenticated")
    } catch (ex) {
        return res.status(400).send({ error: 'Invalid token.' });
    }
    
    next();
}

export { authUser, authUserFromCookie, authAdminUser };