import express from 'express';
import { KYCController } from '../controller/kyc.controller';
import { validateKycData } from '../middleware/validateKyc.middleware';
import { authUser } from '../middleware/authUser';

const router = express.Router();
const kycController = new KYCController();

// Apply auth middleware to all KYC routes
router.use(authUser);

// Create KYC with validation
router.post('/', validateKycData, kycController.createKYC);

// Get all KYCs (with optional country filter)
router.get('/', kycController.getKYCs);

// Get KYC by ID
router.get('/:id', kycController.getKYCById);

// Update KYC by ID with validation
router.put('/:id', validateKycData, kycController.updateKYC);

// Delete KYC by ID
router.delete('/:id', kycController.deleteKYC);

export default router;
