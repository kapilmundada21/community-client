import User from "@/models/user"
import connectDb from "@/middleware/mongoose"
const bcrypt = require("bcrypt");

const handler = async (req, res) => {
    if (req.method == 'POST') {
        let user;
        try{
            user = await User.findOne({ email: req.body.email })
        }
        catch(error){
            console.error(error);
        }
        
        if (!user) {
            const { name, email, password } = req.body
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash( password, salt );
            let newUser = new User({name, email, password : passwordHash })
            await newUser.save();
            res.status(200).json({ success: true, status: newUser.status, id: newUser._id })
            return
        }
        else{
            res.status(200).json({ success: false, error: `User with this Email ID already exist. Your account status is ${user.status}` })
            return
        }
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);