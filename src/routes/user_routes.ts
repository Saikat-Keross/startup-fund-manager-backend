import express from 'express';
//import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controller/user.controller';
import { UserController } from '../controller/user.controller';
import { authUser,authAdminUser } from '../middleware/authUser';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const userController = new UserController();



// const storage = multer.diskStorage({
//     destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
//         //console.log(req.body)
//         cb(null, `./uploads/dispute-evidences/evidence`);
//     },
//     filename: function (req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) {
       
       
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({ storage: storage })

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


router.post('/submitDispute',(req: any, res: any, next: any) => {
    
    console.log("bjbjkbjkbjk");
    const disputeId = uuidv4() //randomly generating a disputeId
    req.customData = { disputeId }
    req.upload = multer({
        storage: multer.diskStorage({
            destination: `./src/uploads/dispute-evidences/evidences-${disputeId}`,// if path not exists multer create automatically
            filename: (req: any, file: { originalname: string }, cb: (err: Error | null, filename: string) => void) => {
                //console.log(file)
                cb(null, file.originalname);
            }
        })
    }).array('files', 5);

    

    next();
},
(req: any, res: any, next: any) => {
    req.upload(req, res, (err: any) => {
        if (err) {
            // console.log(err.message)
            return res.status(500).json({ error: `File upload error: ${err.message}` });
        }
        //console.log("after muter:")
        //console.log(req.body)
        // Reassign the stored disputeId to req.body after multer overwrites it
        req.body.disputeId = req.customData.disputeId;
        next();
    });
},userController.submitDispute);

router.post("/submitCreatorResponse/:id",(req:any,res:any,next:Function)=>{
    const disputeId = req.params.id //randomly generating a disputeId
    req.customData = { disputeId }
    req.upload = multer({
        storage: multer.diskStorage({
            destination: `./src/uploads/dispute-evidences/creator-evidences-${disputeId}`,// if path not exists multer create automatically
            filename: (req: any, file: { originalname: string }, cb: (err: Error | null, filename: string) => void) => {
                console.log(file)
                cb(null, file.originalname);
            }
        })
    }).array('files', 5);
    console.log("uploading...")
    next()


    },(req: any, res: any, next: any) => {
        console.log("still uploading")
        req.upload(req, res, (err: any) => {
            console.log(req.body)
            if (err) {
                console.log(err.message)
                return res.status(500).json({ error: `File upload error: ${err.message}` });
            }
            //console.log("after muter:")
            //console.log(req.body)
            // Reassign the stored disputeId to req.body after multer overwrites it
            req.body.disputeId = req.customData.disputeId;
            console.log("uploaded")
            next();
        })
    },userController.submitCreatorResponse)

export default router;