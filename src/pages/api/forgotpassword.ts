import { NextApiRequest, NextApiResponse } from "next";
import getDB from "../../server/getDB";
import { done, notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";
import crypto from "crypto";
import argon2 from "argon2";
import mailer from "nodemailer";

const EXPIRY_TIME = 1000 * 60 * 60 * 2; // 2 hours

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            const db = await getDB();
            const users = db.collection("users");
            const token = crypto.randomBytes(16).toString("hex");
            console.log(token);
            
            const hash = await argon2.hash(token);
            await users.updateOne({ email: req.body.email }, {
                $set: {
                    passwordResetHash: hash,
                    passwordResetExpires: new Date().getTime() + EXPIRY_TIME,
                },
            });
            const transport = mailer.createTransport({
                service: "gmail",
                auth: {
                    user: "ntf12358@gmail.com", // change at some point
                    pass: "ryzfep-Xacmiv-nubfa4", // change at some point
                },
            });
            const mail = {
                from: "Squool <ntf12358@gmail.com>",
                to: req.body.email,
                subject: "Password reset",
                html: `<a href="http://localhost:3000/resetpassword?token=${token}&email=${req.body.email}">Reset password</a>`,
            };
            transport.sendMail(mail, (err, res) => {
                transport.close();
                if (err) {
                    throw err;
                }
                done(res);
            });
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});