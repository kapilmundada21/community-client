import User from "@/models/user"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'PATCH') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    let user = await User.findOne({ _id: req.body._id })
    if (!user) {
        res.status(200).json({ success: false, error: 'user not found' })
        return
    }

    let newUser = await User.findOneAndUpdate({ _id: req.body._id }, req.body );
    res.status(200).json({ success: true, user: req.body })
    return
}
export default connectDb(handler);