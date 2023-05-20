import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
    if (req.method == 'POST') {
        try {
            await sendgrid.send({
                to: req.body.to,
                from: {
                    name: "Kapil Mundada",
                    email: "kapilmundada21@gmail.com",
                },
                subject: "Reset Password",
                text: "HTML not supported",
                html: `
                        <h2>Greetings</h2>
                        <p>
                            Your request of reset password is fullfilled 
                            please find below link to reset password.
                        </p>
                        <p>
                            Click here to reset password -  
                            <a href="${process.env.NEXT_PUBLIC_HOST}/resetpassword?token=${req.body.token}">reset password</a>
                        </p>
                        <p>
                            <strong>Note: </strong>  
                            This link is valid for only 10min.
                        </p>
                    `,
            });
        } catch (error) {
            // console.error(error);
            return res.status(error.statusCode || 500).json({ error: error.message });
        }

        return res.status(200).json({ success: true, error: "" });
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}

export default sendEmail;