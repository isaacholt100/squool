import tryCatch from "../../server/tryCatch";
import mailer from "nodemailer";

export default (_req, res) => tryCatch(res, async () => {
    //const user = await auth(req, res);
    res.json({
        hi: new Date(),
    })
});