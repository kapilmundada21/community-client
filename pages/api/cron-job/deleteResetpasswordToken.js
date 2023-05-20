import connectDb from "../../../middleware/mongoose"
import User from "../../../models/user"

const handler = async (req, res) => {
    const users = await User.find({ resetPasswordToken : !null });
    users.forEach( async (user) => {
        await User.findOneAndUpdate( { _id: user._id }, { resetPasswordToken : null });
    });
}

export default connectDb(handler);