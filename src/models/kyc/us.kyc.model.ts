import { Schema } from 'mongoose';
import { BaseKYC, IBaseKYC } from './base.kyc.model';

export interface IUsKYC extends IBaseKYC {
    ssn: string;
    isAccreditedInvestor: boolean;
    w9Form?: string;
    accreditationProof?: string;
}

const UsKYCSchema = new Schema({
    ssn: { type: String, required: true },
    isAccreditedInvestor: { type: Boolean, required: true },
    w9Form: { type: String },
    accreditationProof: { type: String }
});

export const UsKYC = BaseKYC.discriminator<IUsKYC>('us', UsKYCSchema);
