import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { done, errors, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";
import { DEFAULT_PERMISSIONS } from "../user";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            const { role, school_id, _id } = await auth(req, res);
            if (role !== "owner") {
                throw new Error("403");
            }
            if (!DEFAULT_PERMISSIONS[req.body.permission] || ![0, 1].includes(req.body.value)) {
                throw new Error("400");
            }
            const db = await getDB();
            const schools = db.collection("schools");
            await schools.updateOne({ _id: school_id, admin_id: _id }, {
                $set: {
                    ["permissions." + req.body.permission]: req.body.value,
                },
            });
            done(res);
            break;
        }
        default: {
            notAllowed(res);
            break;
        }
    }
});