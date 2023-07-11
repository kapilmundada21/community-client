import User from "@/models/user"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'GET') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    let user;
    try {
        user = await User.findOne({ _id: req.query.id });
    } catch (error) {
        console.error(error);
    }
    
    if (!user) {
        res.status(200).json({ success: false, error: 'user not found' })
        return
    }

    res.status(200).json({ success: true, user })
    return
}
export default connectDb(handler);