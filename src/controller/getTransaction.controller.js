import Transaction from '../models/transaction.model';

async function getTransactionsByUserId(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Find all transactions for a specific user
        const transactions = await Transaction.find({ userId }).populate('fundraiserId');

        if (!transactions.length) {
            return res.status(404).json({ error: 'No transactions found for this user' });
        }

        return res.status(200).json(transactions);
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default getTransactionsByUserId;
