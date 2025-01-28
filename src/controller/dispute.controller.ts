import { Request,Response } from "express"
import dispute from "../models/dispute.model"
import fs from 'fs'
import path from 'path'

export class DisputeController{
    public async getDisputeInformation(req:Request,res:Response,next:Function):Promise<void>{
       
    const _disputeId = req.params.id
        //getting dispute details
        const disputeDetails =  await dispute.findOne({disputeId:_disputeId})
        res.status(200).json({_details:disputeDetails,files:req.resources})
        //end
    }
    public async getAlldisputes(req:Request,res:Response,next:Function):Promise<void>{
        const allDisputes = await dispute.find({})
        res.status(200).json(allDisputes)
    }
    public async submitAdminQueries(req:Request,res:Response,next:Function){
        const _disputeId = req.params.id
        const {questions} = req.body
        console.log(req.body)
        if(!questions || questions.length==0)
            return res.status(400).json({message:'Bad Request'})

        try{
        await dispute.updateOne({ disputeId: _disputeId },
            { $set: {adminQueries:questions} })
        
            return res.status(200).json({message:'Dispute has been forwarded to Project Creator'})

        }
        catch(e){
            return res.status(500).json({message:'Error while saving admin queries'})
        }
    }
}