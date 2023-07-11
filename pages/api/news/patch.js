import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'PATCH') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    try {
        let updatedNews = await News.findOneAndUpdate({ _id: req.body._id }, {...req.body, status:"Pending"});
        res.status(200).json({ success: true, news: updatedNews });
        return
    } catch (error) {
        console.error(error);
    }
}
export default connectDb(handler);