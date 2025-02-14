import Transaction from "../models/transaction.model";


export const getLatestTransactions = async(req,res)=>{
    try {
        const selectedUserId = req.user?.id;
        console.log("User ID:", selectedUserId);
        if (!selectedUserId) {
            return res.status(400).json({ error: "User is not loggedin" });
        }
        const transactions = await Transaction.find({userId:selectedUserId}).sort({createdAt:-1}).limit(5).populate('fundraiserId');
        console.log("Latest Transactions:", transactions);
        res.status(200).json(transactions);
    } catch (error) {
        
    }
} 