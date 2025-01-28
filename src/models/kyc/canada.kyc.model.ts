import { Schema } from 'mongoose';
import { BaseKYC, IBaseKYC } from './base.kyc.model';

export interface ICanadaKYC extends IBaseKYC {
    sin: string;  // Social Insurance Number
    isAccreditedInvestor: boolean;
    accreditedInvestorCategory?: string;  // e.g., "Individual", "Corporation", "Investment Fund"
    provinceOfResidence: string;  // Canadian province
    nrbcCompliance?: boolean;  // National Registration Database compliance
    form45_106F9?: string;  // Risk Acknowledgement Form
}

const CanadaKYCSchema = new Schema({
    sin: { type: String, required: true },
    isAccreditedInvestor: { type: Boolean, required: true },
    accreditedInvestorCategory: { type: String },
    provinceOfResidence: { type: String, required: true },
    nrbcCompliance: { type: Boolean },
    form45_106F9: { type: String }
});

export const CanadaKYC = BaseKYC.discriminator<ICanadaKYC>('canada', CanadaKYCSchema);
