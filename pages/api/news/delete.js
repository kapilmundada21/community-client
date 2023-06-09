import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'DELETE') {
        res.status(400).json({ error: "This method is not allowed" });
        return
    }

    let news;
    const newsId = req.query.id;
    
    try {
        news = await News.findOne({ _id: newsId })
    }
    catch (error) {
        console.error(error);
    }

    if (!news) {
        res.status(200).json({ success: false, error: `news does not exist.` });
        return
    }

    let deletedNews = await News.deleteOne({ _id: newsId })
    res.status(200).json({ success: true, news: deletedNews })
    return
}
export default connectDb(handler);