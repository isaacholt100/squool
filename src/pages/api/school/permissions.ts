import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { done, errors, notAllowed } from "../../../server/helpers";
import passwordAuth from "../../../server/passwordAuth";
import tryCatch from "../../../server/tryCatch";
import { DEFAULT_PERMISSIONS } from "../user";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            await passwordAuth(req, res, async () => {
                const { role, school_id, _id } = await auth(req, res);
                if (role !== "owner") {
                    throw new Error("403");
                }
                const updates = {};
                for (const key in req.body.permissions) {
                    if (DEFAULT_PERMISSIONS[key] === undefined || ![0, 1].includes(req.body.permissions[key])) {
                        throw new Error("400");
                    }
                    updates["permissions." + key] = req.body.permissions[key];
                }
                const db = await getDB();
                const schools = db.collection("schools");
                await schools.updateOne({ _id: school_id, admin_id: _id }, {
                    $set: updates,
                });
                done(res);
            });
            break;
        }
        default: {
            notAllowed(res);
            break;
        }
    }
});