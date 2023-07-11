import User from "@/models/user"
import connectDb from "@/middleware/mongoose"
const bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');

const handler = async (req, res) => {

    if (req.method !== 'POST') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
    let user;
    try {
        user = await User.findOne({ "email": req.body.email });
    } catch (error) {
        console.error(error);
    }

    if (!user) {
        res.status(200).json({ success: false, error: 'no user found' })
        return
    }

    const matchPassword = await bcrypt.compare(req.body.password, user.password);
    if (!matchPassword) {
        res.status(200).json({ success: false, error: 'Invalid Credentials' })
        return
    }

    if (user.status === 'Approved') {
        let token = jwt.sign({ email: user.email, name: user.name }, process.env.JWT_SECRET);
        res.status(200).json({ success: true, token, user })
        return
    }
    else {
        res.status(200).json({ success: true, user, error: `Your account status is ${user.status}. please wait!` })
        return
    }
}
export default connectDb(handler);