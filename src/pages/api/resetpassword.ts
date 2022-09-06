import { NextApiRequest, NextApiResponse } from "next";
import getDB from "../../server/getDB";
import { done, notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";
import argon2 from "argon2";
import isStrongPassword from "../../lib/isStrongPassword";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            if (!await isStrongPassword(req.body.password)) {
                throw new Error("400");
            }
            const db = await getDB();
            const users = db.collection("users");
            const user = await users.findOne({ email: req.body.email }, {
                projection: {
                    passwordResetHash: 1,
                    passwordResetExpires: 1,
                },
            });
            if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date().getTime() || !user.passwordResetHash) {
                throw new Error("400");
            }
            const valid = await argon2.verify(user.passwordResetHash, req.body.token);
            if (!valid) {
                throw new Error("400");
            }
            await users.updateOne({ email: req.body.email }, {
                $set: {
                    password: await argon2.hash(req.body.password),
                    accountModifiedTimestamp: new Date().getTime(),
                },
                $unset: {
                    passwordResetHash: null,
                    passwordResetExpires: null,
                },
            });
            done(res);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});