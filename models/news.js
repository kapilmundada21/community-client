const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true, unique:true },
    description: { type: String, required: true },
    img: { type: String },
    publishedBy: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true, default: 'Pending' },
}, { timestamps: true });

mongoose.models = {}
export default mongoose.model("News", NewsSchema);