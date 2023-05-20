import User from "../../models/user"
import connectDb from "../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'PATCH') {
        let user = await User.findOne({ "email": req.body.email })
        if (user) {
            await User.findOneAndUpdate({ "email": req.body.email }, {...req.body, status:"Pending"})
            res.status(200).json({ success: true, email: req.body.email, id: user._id })
            return
        }
        else {
            res.status(200).json({ success: false, error: 'no user found' })
            return
        }
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);