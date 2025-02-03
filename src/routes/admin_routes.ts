import express from 'express';

import { UserController } from '../controller/user.controller';
import { authenticateUser as loginUser ,logout as logoutUser, requestForRoleApproval, responseForRoleApproval } from '../controller/authenticateUser';
import { authUser, authAdminUser } from '../middleware/authUser';
import { getFundraiserRequestsHandler, approveFundraiserRequestHandler } from '../controller/fundraiser.controller';
import { DisputeController } from '../controller/dispute.controller';
import path from 'path';
import fs from 'fs'

const router = express.Router();
const userController = new UserController();
const disputeController = new DisputeController()



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
router.post('/request/campaignResponses',authAdminUser, (req, res) => {
    const id = req.query.id;
    approveFundraiserRequestHandler(req, res);
  });

//router.get('/fetchDisputeInfo/:id',disputeController.getDisputeInformation)
// router.get('/getResources/:id',(req:any,res:any,next:Function)=>{
//   console.log('inside')
//   const rootDir = path.dirname(__dirname)
//   const evidenceDir_ = path.join(rootDir,`uploads/dispute-evidences/evidences-${req.params.id}`)
//   req.makeDirpublicFn = express.static(evidenceDir_)
//   req.evidenceDir = evidenceDir_
  
//   next()

// },
// (req:any,res:any,next:Function)=>{
//   req.makeDirpublicFn(req,res,(err: any)=>{
//     if(err){
//       console.log('failed--')
//       return res.status(500).json({err:'Error While making directories public'})
//     }

    
//   //   fs.readdir(req.evidenceDir, (err, files) => {
//   //     if (err) {
//   //       console.error('Error reading files:', err);
//   //       return res.status(500).json({ error: 'Error reading files in the folder' });
//   //     }

//   //     console.log('suucesssss')
//   //     //next()
  
//   //     // Return the list of files
//   //     res.json({
//   //       files: files.map((file) => ({
//   //         name: file,
//   //         url: file.filePath,
//   //       })),
//   //     });

//   // // })
  
//   //   })
//   // Read directory contents
//       const files = fs.readdirSync(req.evidenceDir);
        
//       // Map files to include full URLs and file information
//         const resources = files.map(filename => {
//         const filePath = path.join(req.evidenceDir, filename);
//         const stats = fs.statSync(filePath);
        
//         // Generate public URL for the file
//         const publicUrl = `/public/uploads/dispute-evidences/evidences-${req.params.id}/${filename}`;
        
//         return {
//           name: filename,
//           size: stats.size,
//           url: filePath,
//           type: path.extname(filename).slice(1).toUpperCase(),
//           lastModified: stats.mtime
//         };
//       });

//       res.json(resources);
// })
// })

const rootDir = path.dirname(__dirname);
const uploadsPath = path.join(rootDir, 'uploads');
router.use('/uploads', express.static(uploadsPath)); //public path to access resouces

router.get('/fetchDisputeInfo/:id', (req: any, res: any,next:Function) => {
  const evidencePath = path.join(rootDir, 'uploads', 'dispute-evidences', `evidences-${req.params.id}`);

  // Check if directory exists
  if (!fs.existsSync(evidencePath)) {
    return res.status(404).json({ error: 'Evidence directory not found' });
  }

  try {
    // Read directory contents
    const files = fs.readdirSync(evidencePath);
    
    // Map files to include full URLs and file information
    const resources = files.map(filename => {
      const filePath = path.join(evidencePath, filename);
      const stats = fs.statSync(filePath);
      
      // Generate public URL for the file
      const publicUrl = `/uploads/dispute-evidences/evidences-${req.params.id}/${filename}`;
      
      return {
        name: filename,
        size: stats.size,
        url: publicUrl,
        type: path.extname(filename).slice(1).toUpperCase(),
        lastModified: stats.mtime
      };
    });

    //res.json(resources);
    req.resources = resources
    next()
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Error reading evidence directory' });
  }
},disputeController.getDisputeInformation);

/* router.post('/campaignRequestResponses',authAdminUser,(req: { body: any; }, res: any) => {
    res.status(400).send({message: "Please provide a valid campaign id"});
}) */

//router.get('/getAlldisputes',disputeController.getAlldisputes)

router.post('/submitAdminQueries/:id',disputeController.submitAdminQueries)

router.get('/fetchLatestDisputeInfo/:id',(req: any, res: any,next:Function)=>{
  // console.log(req.params.id)
  const creator_evidencePath = path.join(rootDir, 'uploads', 'dispute-evidences', `creator-evidences-${req.params.id}`);

  const backer_evidencePath = path.join(rootDir, 'uploads', 'dispute-evidences', `evidences-${req.params.id}`);

  // Check if directory exists
  if (!fs.existsSync(creator_evidencePath) || !fs.existsSync(backer_evidencePath)) {
    return res.status(404).json({ error: 'Evidence directory not found' });
  }

  try {
    // Read directory contents
    const creatorsubmitted_files = fs.readdirSync(creator_evidencePath);
    const backersubmitted_files = fs.readdirSync(backer_evidencePath);
    
    // Map files to include full URLs and file information
    const resources_0 = creatorsubmitted_files.map(filename => {
      const filePath = path.join(creator_evidencePath, filename);
      const stats = fs.statSync(filePath);
      
      // Generate public URL for the file
      const publicUrl = `/uploads/dispute-evidences/creator-evidences-${req.params.id}/${filename}`;
      
      return {
        name: filename,
        size: stats.size,
        url: publicUrl,
        type: path.extname(filename).slice(1).toUpperCase(),
        lastModified: stats.mtime
      };
    });

    const resources_1 = backersubmitted_files.map(filename => {
      const filePath = path.join(backer_evidencePath, filename);
      const stats = fs.statSync(filePath);
      
      // Generate public URL for the file
      const publicUrl = `/uploads/dispute-evidences/evidences-${req.params.id}/${filename}`;
      
      return {
        name: filename,
        size: stats.size,
        url: publicUrl,
        type: path.extname(filename).slice(1).toUpperCase(),
        lastModified: stats.mtime,
        for:'backer'
      };
    });

    



    //res.json(resources);
    req.resources = [...resources_0,...resources_1]
    next()
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Error reading evidence directory' });
  }
  
},disputeController.getLatestDisputeInfo)

router.post('/rejectDispute/:id',disputeController.rejectDispute)


export default router;