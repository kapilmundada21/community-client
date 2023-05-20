import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'PATCH') {
        let news;
        try{
            news = await News.findOne({ title: req.body.title })
        }
        catch(error){
            console.error(error);
        }

        if (news) {
            let updatedNews = await News.findOneAndUpdate({ title: req.body.title }, req.body )
            await updatedNews.save();
            res.status(200).json({ success: true, news: updatedNews })
            return
        }
        else{
            res.status(200).json({ success: false, error: `news with this title does not exist.` })
            return
        }
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);