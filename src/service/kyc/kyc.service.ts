import { KYCFactory, KYCDocument } from './kyc.factory';

export class KYCService {
    public async createKYC(country: string, data: any): Promise<KYCDocument> {
        return KYCFactory.createKYC(country, data);
    }

    public async getKYCs(): Promise<KYCDocument[]> {
        return KYCFactory.getAllKYCs();
    }

    public async getKYCById(id: string): Promise<KYCDocument | null> {
        return KYCFactory.getKYCById(id);
    }

    public async getKYCsByCountry(country: string): Promise<KYCDocument[]> {
        return KYCFactory.getKYCsByCountry(country);
    }

    public async updateKYC(id: string, data: Partial<KYCDocument>): Promise<KYCDocument | null> {
        return KYCFactory.updateKYC(id, data);
    }

    public async deleteKYC(id: string): Promise<KYCDocument | null> {
        return KYCFactory.deleteKYC(id);
    }

    public validateKYCData(country: string, data: any): boolean {
        // Implement country-specific validation logic
        console.log("Country =>", country);
        switch (country.toLowerCase()) {
            case 'us':
                return this.validateUsKYC(data);
            case 'eu':
                return this.validateEuKYC(data);
            case 'canada':
                return this.validateCanadaKYC(data);
            default:
                return this.validateBaseKYC(data);
        }
    }

    private validateBaseKYC(data: any): boolean {
        const requiredFields = [
            'firstName',
            'lastName',
            'dob',
            'nationality',
            'countryName',
            'address',
            'city',
            'state',
            'zipCode',
            'annualIncome',
            'netWorth'
        ];
        console.log("Base data =>", data);
        console.log("Required Fields =>", requiredFields.every(field => data[field] !== undefined));
        return requiredFields.every(field => data[field] !== undefined);
    }

    private validateUsKYC(data: any): boolean {
        return (
            this.validateBaseKYC(data) &&
            data.ssn !== undefined &&
            data.isAccreditedInvestor !== undefined
        );
    }

    private validateEuKYC(data: any): boolean {
        return (
            this.validateBaseKYC(data) &&
            data.taxIdentificationNumber !== undefined &&
            data.gdprConsent !== undefined &&
            data.gdprConsentDate !== undefined &&
            data.isMifidCompliant !== undefined
        );
    }

    private validateCanadaKYC(data: any): boolean {
        return (
            this.validateBaseKYC(data) &&
            data.sin !== undefined &&
            data.isAccreditedInvestor !== undefined &&
            data.provinceOfResidence !== undefined
        );
    }
}
