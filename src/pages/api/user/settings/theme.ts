import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../../server/auth";
import getDB from "../../../../server/getDB";
import { notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";
import updateSettings from "../../../../server/updateSettings";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            if (["theme.primary", "theme.secondary", "theme.type", "theme.fontFamily", "theme"].includes(req.body.path)) {
                await updateSettings(req, res, {
                    [req.body.path]: req.body.val,
                });
            } else {
                throw new Error("Invalid theme path");
            }
            break;
        }
        case "GET": {
            if (req.cookies.user_id) {
                const db = await getDB();
                const users = db.collection("users");
                const { theme } = await users.findOne({ _id: new ObjectId(req.cookies.user_id) }, { projection: { theme: 1, _id: 0 }});
                res.json(theme);
            } else {
                res.json({});
            }
        }
        default: {
            notAllowed(res);
        }
    }
});