import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'GET') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    const page = req.query.page;
    const offset = req.query.offset;
    let totalNews = await News.countDocuments({ userId: req.query.userId });
    let news = await News.find({ userId: req.query.userId }).sort({ "createdAt": -1 }).skip(page * offset).limit(offset);
    res.status(200).json({ success: true, allNews: news, totalNews })
    return
}
export default connectDb(handler);