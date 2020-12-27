import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../server/auth";
import getDB from "../../server/getDB";
import { didUpdate, done, notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const reminders = db.collection("reminders");
            const { date, name, desc, repeat, allDay } = req.body;
            if (!date || typeof(date) !== "string" || !name) {
                throw new Error("400");
            }
            const r = await reminders.insertOne({
                owner_id: _id,
                date: new Date(date),
                name,
                desc: desc || "",
                repeat,
                allDay,
                ...(req.body._id ? {_id: new ObjectId(req.body._id)} : {})
            });
            res.json(r.insertedId);
            break;
        }
        case "DELETE": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const reminders = db.collection("reminders");
            const r = await reminders.deleteOne({ _id: new ObjectId(req.body._id), owner_id: _id });
            didUpdate(res, r.deletedCount);
            break;
        }
        case "PUT": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const reminders = db.collection("reminders");
            const { date, name } = req.body;
            if (!date || typeof(date) !== "string" || !name) {
                throw new Error("400");
            }
            await reminders.updateOne({ owner_id: _id, _id: new ObjectId(req.body._id) }, {$set: { name: req.body.name, date: new Date(req.body.date), desc: req.body.desc, repeat: req.body.repeat, allDay: req.body.allDay }});
            done(res);
            break;
        }
        case "GET": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const reminders = db.collection("reminders");
            const list = await reminders.find({ owner_id: _id }).toArray();
            res.json(list);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});