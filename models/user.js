const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique:true },
    gender: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    password: { type: String },
    status: { type: String, required: true, default: 'Pending' },
    resetPasswordToken : { type: String, },
}, { timestamps: true });

mongoose.models = {}
export default mongoose.model("User", UserSchema);