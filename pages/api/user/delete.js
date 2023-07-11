import User from "@/models/user"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'DELETE') {
        res.status(400).json({ error: "This method is not allowed" });
        return
    }

    let user;
    const userId = req.query.id;
    
    try {
        user = await User.findOne({ _id: userId })
    }
    catch (error) {
        console.error(error);
    }

    if (!user) {
        res.status(200).json({ success: false, error: `user does not exist.` });
        return
    }

    let deletedUser = await User.deleteOne({ _id: userId })
    res.status(200).json({ success: true, user: deletedUser })
    return
}
export default connectDb(handler);