import tryCatch from "../../server/tryCatch";
import mailer from "nodemailer";

export default (_req, res) => {
    res.json({ message: "hello" });
};