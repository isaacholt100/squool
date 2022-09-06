import { NextApiRequest, NextApiResponse } from "next";
import { didUpdate, errors, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";
import argon2 from "argon2";
import getDB from "../../../server/getDB";
import auth from "../../../server/auth";
import { deleteRefreshToken } from "../../../server/cookies";
import isStrongPassword from "../../../lib/isStrongPassword";

export const SALT_ROUNDS = 12;

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            const { newPassword, oldPassword } = req.body;
            if (!await isStrongPassword(newPassword)) {
                throw new Error("400");
            } else {
                const { _id } = await auth(req, res);
                const db = await getDB();
                const users = db.collection("users");
                const hash = (await users.findOne({ _id }, {projection: { password: 1, _id: 0 }}))?.password;
                const valid = await argon2.verify(hash, oldPassword);
                if (valid) {
                    const r = await users.updateOne({ _id }, {
                        $set: {
                            password: await argon2.hash(newPassword),
                            accountModifiedTimestamp: new Date().getTime(),
                        },
                    });
                    deleteRefreshToken(res);
                    didUpdate(res, r.modifiedCount);
                } else {
                    errors(res, {
                        oldPasswordError: "Password is incorrect",
                    });
                }
            }
        }
        default: {
            notAllowed(res);
        }
    }
});