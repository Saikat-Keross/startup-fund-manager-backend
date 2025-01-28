import { Document } from 'mongoose';
import { IBaseKYC, BaseKYC } from '../../models/kyc/base.kyc.model';
import { IUsKYC, UsKYC } from '../../models/kyc/us.kyc.model';
import { IEuKYC, EuKYC } from '../../models/kyc/eu.kyc.model';
import { ICanadaKYC, CanadaKYC } from '../../models/kyc/canada.kyc.model';

export type KYCDocument = IBaseKYC | IUsKYC | IEuKYC | ICanadaKYC;

export class KYCFactory {
    static createKYC(country: string, data: any): Promise<KYCDocument> {
        switch (country.toLowerCase()) {
            case 'us':
                return UsKYC.create({ ...data, country: 'us' });
            case 'eu':
                return EuKYC.create({ ...data, country: 'eu' });
            case 'canada':
                return CanadaKYC.create({ ...data, country: 'canada' });
            default:
                return BaseKYC.create({ ...data, country: 'base' });
        }
    }

    static async getKYCById(id: string): Promise<KYCDocument | null> {
        return BaseKYC.findById(id);
    }

    static async updateKYC(id: string, data: Partial<KYCDocument>): Promise<KYCDocument | null> {
        return BaseKYC.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteKYC(id: string): Promise<KYCDocument | null> {
        return BaseKYC.findByIdAndDelete(id);
    }

    static async getAllKYCs(): Promise<KYCDocument[]> {
        return BaseKYC.find();
    }

    static async getKYCsByCountry(country: string): Promise<KYCDocument[]> {
        return BaseKYC.find({ country });
    }
}
