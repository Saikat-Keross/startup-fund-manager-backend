import { Request, Response, NextFunction } from 'express';
import { KYCService } from '../service/kyc/kyc.service';

export const validateKycData = (req: Request, res: Response, next: NextFunction) => {
    const kycService = new KYCService();
    const { country, ...data } = req.body;

    if (!country) {
        return res.status(400).json({ error: 'Country is required' });
    }

    // For update operations
    if (req.method === 'PUT') {
        return next(); // Skip validation as it's handled in the controller for updates
    }

    // Validate data based on country requirements
    if (!kycService.validateKYCData(country, data)) {
        return res.status(400).json({
            error: `Invalid KYC data for ${country}. Please provide all required fields.`,
            requiredFields: getRequiredFields(country)
        });
    }
    console.log("Validation done");

    next();
};

function getRequiredFields(country: string): string[] {
    const baseFields = [
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
    console.log("country =>", country);
    switch (country.toLowerCase()) {
        case 'us':
            return [...baseFields, 'ssn', 'isAccreditedInvestor'];
        case 'eu':
            return [
                ...baseFields,
                'taxIdentificationNumber',
                'gdprConsent',
                'gdprConsentDate',
                'isMifidCompliant'
            ];
        case 'canada':
            return [
                ...baseFields,
                'sin',
                'isAccreditedInvestor',
                'provinceOfResidence'
            ];
        default:
            return baseFields;
    }
}
