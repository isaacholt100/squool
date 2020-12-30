import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../../server/auth";
import getDB from "../../../../server/getDB";
import { done, notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            if (!["r", "s", "t"].includes(req.body.key) || req.body.day > 6 || req.body.day < 0 || typeof(req.body.value) !== "string") {
                throw new Error("400");
            }
            await users.updateOne({ _id }, req.body.sat !== undefined ? req.body.sat ? { $set: {"timetable.lessons.5": Array(req.body.length).fill({
                s: "",
                t: "",
                r: ""
            }) }} : {$unset: {"timetable.lessons.5": ""}} : {
                $set: {[`timetable.lessons.${req.body.day}.${req.body.period}.${req.body.key}`]: req.body.value}
            });
            done(res);
            break;
        }
        case "POST": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            await users.updateOne({ _id }, {
                $set: {timetable: req.body}
            });
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});