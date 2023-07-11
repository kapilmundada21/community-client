import User from "@/models/user"
import connectDb from "@/middleware/mongoose"
const bcrypt = require("bcrypt");

const handler = async (req, res) => {
    
    if (req.method !== 'POST') {
        res.status(400).json({ error: "This method is not allowed" });
        return
    }
    
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(200).json({ success: false, error: `User with this Email ID already exist. Your account status is ${user.status}` })
            return
        }
    }
    catch (error) {
        console.error(error);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    let newUser = new User({ ...req.body, password: passwordHash })
    await newUser.save();
    res.status(200).json({ success: true, status: newUser.status, id: newUser._id })
    return
}
export default connectDb(handler);