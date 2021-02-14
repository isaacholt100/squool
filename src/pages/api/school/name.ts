import { NextApiRequest, NextApiResponse } from "next";
import { roleHasPermission } from "../../../lib/role";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { done, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            const { role, school_id } = await auth(req, res);
            const db = await getDB();
            const schools = db.collection("schools");
            const { permissions } = await schools.findOne({ _id: school_id }, {
                projection: {
                    permissions: 1,
                }
            });
            if (typeof(req.body.name) !== "string" || !req.body.name) {
                throw new Error("400");
            }
            if (roleHasPermission(role, permissions.changeName)) {
                await schools.updateOne({ _id: school_id }, {
                    $set: {
                        name: req.body.name
                    }
                });
                done(res);
            } else {
                throw new Error("403");
            }
            break;
        }
        default: {
            notAllowed(res);
            break;
        }
    }
});