import { Schema } from 'mongoose';
import { BaseKYC, IBaseKYC } from './base.kyc.model';

export interface IEuKYC extends IBaseKYC {
    taxIdentificationNumber: string;
    gdprConsent: boolean;
    gdprConsentDate: Date;
    mifidAssessment?: string;
    proofOfAddress?: string;
    isMifidCompliant: boolean;
}

const EuKYCSchema = new Schema({
    taxIdentificationNumber: { type: String, required: true },
    gdprConsent: { type: Boolean, required: true },
    gdprConsentDate: { type: Date, required: true },
    mifidAssessment: { type: String },
    proofOfAddress: { type: String },
    isMifidCompliant: { type: Boolean, required: true }
});

export const EuKYC = BaseKYC.discriminator<IEuKYC>('eu', EuKYCSchema);
