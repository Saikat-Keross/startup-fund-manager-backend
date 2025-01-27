import { Schema, model, Document } from 'mongoose';

export interface IBaseKYC extends Document {
    country: string;  // Discriminator field for the model type
    firstName: string;
    lastName: string;
    dob: Date;
    nationality: string;
    countryName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    annualIncome: number;
    netWorth: number;
    idFront?: string;
    idBack?: string;
    incomeProof?: string;
    netWorthStatement?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BaseKYCSchema = new Schema<IBaseKYC>(
    {
        country: { type: String, required: true },  // Discriminator field
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dob: { type: Date, required: true },
        nationality: { type: String, required: true },
        countryName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        annualIncome: { type: Number, required: true },
        netWorth: { type: Number, required: true },
        idFront: { type: String },
        idBack: { type: String },
        incomeProof: { type: String },
        netWorthStatement: { type: String },
    },
    {
        timestamps: true,
        discriminatorKey: 'country'
    }
);

export const BaseKYC = model<IBaseKYC>('KYC', BaseKYCSchema);
