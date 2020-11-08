import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../server/auth";
import getDB from "../../server/getDB";
import { done, notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const timetables = db.collection("timetables");
            await timetables.insertOne({ name: req.body.name, periods: req.body.periods, sat: req.body.sat });
            done(res);
            break;
        }
        case "GET": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const timetables = db.collection("timetables");
            res.json(await timetables.find({ name: {$regex: RegExp(req.query.val as string), $options: "imxs"} }).toArray());
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});