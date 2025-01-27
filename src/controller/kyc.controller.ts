import { Request, Response } from 'express';
import { KYCService } from '../service/kyc/kyc.service';
import { KYCDocument } from '../service/kyc/kyc.factory';

export class KYCController {
    private kycService: KYCService;

    constructor() {
        this.kycService = new KYCService();
    }

    public createKYC = async (req: Request, res: Response): Promise<void> => {
        console.log("Inside createKYC");
        try {
            const { country, ...data } = req.body;

            console.log("Country =>", country);
            
            if (!country) {
                res.status(400).json({ error: 'Country is required' });
                return;
            }

            // Validate data based on country requirements
            const validation = this.kycService.validateKYCData(country,data);
            console.log("Validation =>", validation);
            if (!validation) {
                res.status(400).json({ 
                    error: `Invalid KYC data for ${country}. Please provide all required fields.` 
                });
                return;
            }

            const result = await this.kycService.createKYC(country, data);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public getKYCs = async (req: Request, res: Response): Promise<void> => {
        try {
            const { country } = req.query;
            let kycs: KYCDocument[];

            if (country) {
                kycs = await this.kycService.getKYCsByCountry(country as string);
            } else {
                kycs = await this.kycService.getKYCs();
            }

            res.status(200).json(kycs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public getKYCById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const kyc = await this.kycService.getKYCById(id);
            if (kyc) {
                res.status(200).json(kyc);
            } else {
                res.status(404).json({ message: 'KYC not found' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public updateKYC = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const data = req.body;
            
            // Get the existing KYC to check its country
            const existingKYC = await this.kycService.getKYCById(id);
            if (!existingKYC) {
                res.status(404).json({ message: 'KYC not found' });
                return;
            }

            // Validate the update data against country-specific requirements
            if (!this.kycService.validateKYCData(existingKYC.country, { ...existingKYC.toObject(), ...data })) {
                res.status(400).json({ 
                    error: `Invalid KYC data for ${existingKYC.country}. Please provide all required fields.` 
                });
                return;
            }

            const updatedKYC = await this.kycService.updateKYC(id, data);
            res.status(200).json(updatedKYC);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public deleteKYC = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const result = await this.kycService.deleteKYC(id);
            
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'KYC not found' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
