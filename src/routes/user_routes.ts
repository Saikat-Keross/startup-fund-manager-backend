import express from 'express';
//import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controller/user.controller';
import { UserController } from '../controller/user.controller';
import { authUser,authAdminUser } from '../middleware/authUser';
import multer from 'multer';
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { DisputeController } from '../controller/dispute.controller';


const router = express.Router();
const userController = new UserController();
const disputeController = new DisputeController()



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

const blankmulter = multer()

// router.post(
//     "/submitCreatorResponse/:id",
//     (req: any, res: any, next: Function) => {
//       //console.log("req=> ",req.files)
//       const disputeId = req.params.id;
//       req.customData = { disputeId };
  
    
  
//       // Parse text fields first
//       multer().any()(req, res, (err: any) => {
//         if (err) {
//             console.log(err.message)
//           return res.status(400).json({ error: "Error parsing request body" });
//         }
  
//         try {
//           // Parse dynamic upload fields from request body
//           const uploadFields = JSON.parse(req.body.responses).map((e: any) => ({
//             name: `question_${e.questionId}`,
//             maxCount: 5,
//           }));
//           console.log(uploadFields)
  
//           // Define multer upload middleware dynamically
//           req.upload = multer({
//             storage: multer.diskStorage({
//               destination: `./src/uploads/dispute-evidences/creator-evidences-${disputeId}`,
//               filename: (req: any, file: { originalname: string }, cb: any) => {
//                 cb(null, file.originalname);
//               },
//             }),
//           }).fields(uploadFields);
  
//           next();
//         } catch (parseError) {
//           return res.status(400).json({ error: "Invalid responses format" });
//         }
//       });
//     },
//     (req: any, res: any, next: any) => {
//       req.upload(req, res, (err: any) => {
//         if (err) {
//             console.log(err.message)
//           return res.status(500).json({ error: `File upload error: ${err.message}` });
//         }
  
//         req.body.disputeId = req.customData.disputeId;
//         console.log("File upload complete");
//         next();
//       });
//     },
//     userController.submitCreatorResponse
//   );
// router.post(
//     "/submitCreatorResponse/:id",
//     (req, res, next) => {
//       const disputeId = req.params.id;
//         console.log("request body=>",req.body)
//       try {
//         // Parse dynamic upload fields from request body
//         const responses = JSON.parse(req.body.responses);
//         const uploadFields = responses.map((e) => ({
//           name: `question_${e.questionId}`,
//           maxCount: 5,
//         }));
  
//         // Define multer upload middleware dynamically
//         const upload = multer({
//           storage: multer.diskStorage({
//             destination: (req, file, cb) => {
//               const dir = `./src/uploads/dispute-evidences/creator-evidences-${disputeId}`;
//               // Ensure the directory exists (you may need to use `fs.mkdir` here)
//               cb(null, dir);
//             },
//             filename: (req, file, cb) => {
//               // Use a unique filename to avoid conflicts
//               const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//               const ext = path.extname(file.originalname);
//               cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//             },
//           }),
//         }).fields(uploadFields);
  
//         // Apply the multer middleware
//         upload(req, res, (err) => {
//           if (err) {
//             console.error("Multer error:", err.message);
//             return res.status(500).json({ error: `File upload error: ${err.message}` });
//           }
  
//           // Attach disputeId to the request for the next middleware
//           req.body.disputeId = disputeId;
//           console.log("File upload complete");
//           next();
//         });
//       } catch (parseError) {
//         console.error("Error parsing responses:", parseError.message);
//         return res.status(400).json({ error: "Invalid responses format" });
//       }
//     },
//     userController.submitCreatorResponse
//   );
router.post(
    "/submitCreatorResponse/:id",
    (req, res, next) => {
      const disputeId = req.params.id;
    console.log(req.query)
      try {
        // Parse `responses` from the query parameter
        const responses = JSON.parse(req.query.responses);
        req.creatorResponse = responses
        const uploadFields = responses.map((e) => ({
          name: `question_${e.questionId}`,
          maxCount: 5,
        }));
  
        // Ensure the upload directory exists
        const dir = `./src/uploads/dispute-evidences/creator-evidences-${disputeId}`;
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
  
        // Define multer upload middleware dynamically
        const upload = multer({
          storage: multer.diskStorage({
            
            destination: (req, file, cb) => {
              cb(null, dir);
            },
            filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
              const ext = path.extname(file.originalname);
              cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
          }),
        }).fields(uploadFields);
  
        // Apply the multer middleware
        upload(req, res, (err) => {
          if (err) {
            console.error("Multer error:", err.message);
            return res.status(500).json({ error: `File upload error: ${err.message}` });
          }
  
          // Attach disputeId to the request for the next middleware
          req.body.disputeId = disputeId;
          console.log("File upload complete");
          next();
        });
      } catch (parseError) {
        console.error("Error parsing responses:", parseError.message);
        return res.status(400).json({ error: "Invalid responses format" });
      }
    },
    userController.submitCreatorResponse
  );

  router.get("/getDisputeInfo/:id",disputeController.getDisputeInformation)
  

export default router;