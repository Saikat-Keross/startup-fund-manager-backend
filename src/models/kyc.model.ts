import { Schema, model, Document } from 'mongoose';

interface IKYC extends Document {
    firstName: string;
    lastName: string;
    dob: Date;
    nationality: string;
    countryName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    isUsCitizen: boolean;
    ssn?: string;
    tin: string;
    annualIncome: number;
    netWorth: number;
    idFront?: string;
    idBack?: string;
    incomeProof?: string;
    netWorthStatement?: string;
    createdAt: Date;
    updatedAt: Date;
}

const KYCSchema = new Schema<IKYC>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dob: { type: Date, required: true },
        nationality: { type: String, required: true },
        countryName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        isUsCitizen: { type: Boolean, required: true },
        ssn: { type: String },
        tin: { type: String, required: true },
        annualIncome: { type: Number, required: true },
        netWorth: { type: Number, required: true },
        idFront: { type: String },
        idBack: { type: String },
        incomeProof: { type: String },
        netWorthStatement: { type: String },
    },
    {
        timestamps: true,
    }
);

export const KYC = model<IKYC>('KYC', KYCSchema);