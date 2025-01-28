import Transaction from '../models/transaction.model';

async function getAllTransactions(req, res) {
    try {
        const transactions = await Transaction.find();
        console.log("===================== All Transactions:", transactions);

        return res.status(200).json(transactions);
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default getAllTransactions;
