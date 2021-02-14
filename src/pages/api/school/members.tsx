import { ObjectID } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { roleHasPermission } from "../../../lib/role";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { done, errors, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            
            break;
        }
        case "GET": {
            const { school_id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            const list = users.find({ school_id }, {
                projection: {
                    email: 1,
                    icon: 1,
                    role: 1,
                    firstName: 1,
                    lastName: 1,
                }
            });
            res.json(await list.toArray());
            break;
        }
        case "DELETE": {
            const { school_id, role } = await auth(req, res);
            const db = await getDB();
            const schools = db.collection("schools");
            const { permissions } = await schools.findOne({ _id: school_id }, {
                projection: {
                    permissions: 1,
                }
            });
            if (!roleHasPermission(role, permissions.removeUsers)) {
                throw new Error("403");
            }
            const users = db.collection("users");
            await users.updateOne({ _id: new ObjectID(req.body.user_id), $or: role === "owner" ? [{ role: "admin" }, { role: "student" }, { role: "teacher" }] : [{ role: "student" }, { role: "teacher" }] }, {
                $set: {
                    school_id: null,
                }
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