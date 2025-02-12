import { Request,Response } from "express"
import dispute from "../models/dispute.model"
import fs from 'fs'
import path from 'path'
import { getUserById, getUsers } from "../service/user.service"
import jwt from 'jsonwebtoken'
import Fundraiser from "../models/fundraiser.model"

export class DisputeController{
    public async getDisputeInformation(req:Request,res:Response,next:Function):Promise<void>{
       
    const _disputeId = req.params.id
    console.log(_disputeId)
        //getting dispute details
        const disputeDetails =  await dispute.findOne({disputeId:_disputeId})
        console.log(disputeDetails)
        const disputedRaiserId = disputeDetails?.rasiedBy
        console.log("res=> "+disputedRaiserId)
        //const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const users_ = await getUsers()
        //console.log(users_)
        //res.status(200).json({_details:{...disputeDetails,rasiedBy:users_.filter(e=>e._id.toString() === disputedRaiserId?.toString())[0].username},files:req.resources})
        //end
        const user = users_.find(e => e._id.toString() === disputedRaiserId?.toString());
        const disputeDetailsObj = disputeDetails?.toObject(); // Convert Mongoose document to plain object

        res.status(200).json({
            _details: {
                ...disputeDetailsObj,
                rasiedBy: user ? user.username : 'Unknown User' // Add the username to the response
            },
            files: req.resources
        });

    }
    // public async getAlldisputes(req:Request,res:Response,next:Function):Promise<void>{
    //     const allDisputes = await dispute.find({})
    //     res.status(200).json(allDisputes)
    // }
    public async submitAdminQueries(req:Request,res:Response,next:Function){
        const _disputeId = req.params.id
        const {questions,status} = req.body
        console.log(req.body)
        if(!questions || questions.length==0)
            return res.status(400).json({message:'Bad Request'})

        try{
        await dispute.updateOne({ disputeId: _disputeId },
            { $set: {adminQueries:questions,status:status} })
        
            return res.status(200).json({message:'Dispute has been forwarded to Project Creator'})

        }
        catch(e){
            return res.status(500).json({message:'Error while saving admin queries'})
        }
    }
    public async getLatestDisputeInfo(req:Request,res:Response,next:Function){
        const _disputeId = req.params.id


        const disputeDetails = await dispute.findOne({ disputeId: _disputeId })
        const campaignDetails = await Fundraiser.findOne({ _id: disputeDetails?.toObject().campaignId })
        console.log(campaignDetails)
        const creatorDetails = await getUserById(campaignDetails?.toObject().userId);
        const creatorDetailsObj = creatorDetails?.toObject(); // Convert Mongoose document to plain object
        console.log(creatorDetailsObj)
        const backerDetails = await getUserById(disputeDetails?.toObject().rasiedBy);
        const backerDetailsObj = backerDetails?.toObject(); // Convert Mongoose document to plain object


        return res.status(200).json({
            _details: {
                ...disputeDetails?.toObject(),
                campaign: campaignDetails?.toObject(),
                creator: {username:creatorDetailsObj?.username,email:creatorDetailsObj?.email},
                backer:{username:backerDetailsObj?.username,email:backerDetailsObj?.email}
                
            },
            files: req.resources
        });
        //return res.status(200).json({ _details: disputeDetails, files: req.resources })
           
        

        

    }
    public async rejectDispute(req:Request,res:Response,next:Function){
        const _disputeId = req.params.id
        
        
        const disputeDetails =  await dispute.updateOne({disputeId:_disputeId},{$set:{status:"Rejected"}})
        res.status.json({message:"Dispute Rejected."})
    }
    public async approveDispute(req:Request,res:Response,next:Function){
        const _disputeId = req.params.id
        
        
        const disputeDetails =  await dispute.updateOne({disputeId:_disputeId},{$set:{status:"Resolved"}})
        res.status.json({message:"Dispute Approved."})
    }
}