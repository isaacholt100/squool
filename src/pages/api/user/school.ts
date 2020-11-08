import { serialize } from "cookie";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { done, errors, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const schools = db.collection("schools");
            const users = db.collection("users");
            const exists = ObjectId.isValid(req.body.school_id) && await schools.countDocuments({ _id: new ObjectId(req.body.school_id) }) === 1;
            if (exists) {
                await users.updateOne({ _id }, {
                    $set: {
                        school_id: new ObjectId(req.body.school_id),
                    },
                });
                res.setHeader("Set-Cookie", serialize("httpRefreshToken", "", {
                    maxAge: -1,
                    httpOnly: true,
                    sameSite: "strict",
                }));
                done(res);
            } else {
                errors(res, "School not found");
            }
            break;
        }
        case "DELETE": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            await users.updateOne({ _id }, {
                $set: {
                    school_id: null,
                },
            });
            res.setHeader("Set-Cookie", serialize("httpRefreshToken", "", {
                maxAge: -1,
                httpOnly: true,
                sameSite: "strict",
            }));
            done(res);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});