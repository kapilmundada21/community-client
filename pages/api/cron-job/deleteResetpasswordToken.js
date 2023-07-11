import connectDb from "@/middleware/mongoose"
import User from "@/models/user"

const string = /.*/

const handler = async (req, res) => {
    let users = await User.find({ resetPasswordToken: string });
    users.forEach( async (user) => {
        await User.findOneAndUpdate( { _id: user._id }, { resetPasswordToken : null });
    });
    res.status(200).json({ status: true, users});
    return
}

export default connectDb(handler);