import { ObjectId } from "mongodb";
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
            const users = db.collection("users");
            const user_id = new ObjectId(req.body.user_id);
            const other_school_id = (await users.findOne({ _id: user_id }, {
                projection: {
                    school_id: 1,
                }
            })).school_id;
            if (other_school_id !== school_id || typeof(req.body.roleTitle) !== "string" || req.body.roleTitle) {
                throw new Error("400");
            }
            const schools = db.collection("schools");
            const { permissions } = await schools.findOne({ _id: school_id }, {
                projection: {
                    permissions: 1,
                }
            });
            if (roleHasPermission(role, permissions.changeRoles)) {
                await schools.updateOne({ _id: school_id }, {
                    $set: {
                        ["roles." + req.body.roleTitle]: user_id,
                    }
                });
                done(res);
            } else {
                throw new Error("403");
            }
            break;
        }
        case "DELETE": {
            const { role, school_id } = await auth(req, res);
            const db = await getDB();
            const schools = db.collection("schools");
            const { permissions } = await schools.findOne({ _id: school_id }, {
                projection: {
                    permissions: 1,
                }
            });
            if (!req.body.roleTitle) {
                throw new Error("400");
            }
            if (roleHasPermission(role, permissions.changeRoles)) {
                await schools.updateOne({ _id: school_id }, {
                    $unset: {
                        ["roles." + req.body.roleTitle]: "",
                    },
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