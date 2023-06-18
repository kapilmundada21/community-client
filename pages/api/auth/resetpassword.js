import connectDb from "@/middleware/mongoose"
import User from "@/models/user"
const bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    if (req.body.sendMail) {
        // Check if the user exists in the Database
        let user = await User.findOne({ "email": req.body.email })
        if (user) {
            let token = jwt.sign({ email: user.email, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET, { expiresIn: 1000 * 60 * 10 });
            await User.findOneAndUpdate({ email: user.email }, { resetPasswordToken: token })
            res.status(200).json({ success: true, token });
            return
        }
        else {
            res.status(200).json({ success: false, error: 'User not found' })
            return
        }
    }
    else {
        let dbtoken = await User.findOne({ resetPasswordToken: req.body.token })
        if (dbtoken) {
            let valid = await jwt.verify(dbtoken.resetPasswordToken, process.env.JWT_SECRET, (error, result) => {
                return result ? true : false
            })
            if (valid) {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(req.body.password, salt);
                await User.findOneAndUpdate({ email: dbtoken.email }, { password: passwordHash, resetPasswordToken: null })
                res.status(200).json({ success: true })
                return
            } else {
                res.status(200).json({ success: false, error: 'Token Expired' })
            }
        }
        res.status(200).json({ success: false, error: 'Invalid Token' })
        return
    }
}
export default connectDb(handler);