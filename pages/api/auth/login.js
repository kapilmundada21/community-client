import User from "@/models/user"
import connectDb from "@/middleware/mongoose"
const bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    if (req.method == 'POST') {
        let user = await User.findOne({ "email": req.body.email })
        if (user) {
            const matchPassword = await bcrypt.compare( req.body.password, user.password );
            if (matchPassword) {
                if(user.status === 'Approved'){
                    let token = jwt.sign({ email: user.email, name: user.name }, process.env.JWT_SECRET);
                    res.status(200).json({ success: true, token, user })
                    return
                }  
                else if (user.status === 'Pending') {
                    res.status(200).json({ success: false, status: user.status, id: user._id, error: 'Your account status is pending. please wait!' })
                    return
                }
            }
            else {
                res.status(200).json({ success: false, error: 'Invalid Credentials' })
                return
            }
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