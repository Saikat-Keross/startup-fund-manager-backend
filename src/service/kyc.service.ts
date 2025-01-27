import { KYC } from '../models/kyc.model';

export class KYCService {
    private kycs: KYC[] = [];

    public async createKYC(data: Partial<KYC>): Promise<KYC> {
        const newKYC: KYC = {
            id: this.generateId(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as KYC;
        this.kycs.push(newKYC);
        return newKYC;
    }

    public async getKYCs(): Promise<KYC[]> {
        return this.kycs;
    }

    public async getKYCById(id: string): Promise<KYC | undefined> {
        return this.kycs.find(kyc => kyc.id === id);
    }

    public async updateKYC(id: string, data: Partial<KYC>): Promise<KYC | undefined> {
        const index = this.kycs.findIndex(kyc => kyc.id === id);
        if (index !== -1) {
            this.kycs[index] = { ...this.kycs[index], ...data, updatedAt: new Date() };
            return this.kycs[index];
        }
        return undefined;
    }

    public async deleteKYC(id: string): Promise<boolean> {
        const index = this.kycs.findIndex(kyc => kyc.id === id);
        if (index !== -1) {
            this.kycs.splice(index, 1);
            return true;
        }
        return false;
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}