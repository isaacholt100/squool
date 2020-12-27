import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { didUpdate, done, errors, forbidden, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            const { _id, role, school_id } = await auth(req, res);
            const db = await getDB();
            const classes = db.collection("classes");
            if (role !== "student") {
                const r = await classes.insertOne({
                    name: req.body.name,
                    member_ids: [_id, ...req.body.teacher_ids],
                    yearGroup: req.body.yearGroup,
                    school_id,
                    //*Keep just in case* member_ids: [],
                });
                res.json(r.insertedId);
                /*req.body.teacher_ids.forEach(i => io.in(i._id).emit("/classes/create", {
                    _id: r.insertedId,
                    name: req.body.name,
                    yearGroup: req.body.yearGroup,
                    member_ids: [req.body.teachers.map(t => t._id), req.user.user_id],
                    teacherInfo: [
                        req.body.teachers, {name: req.cookies.name, email: req.cookies.email, user_id: req.user.user_id, icon: req.cookies.icon}] }, true));*/
            } else {
                forbidden(res);
            }
            break;
        }
        case "DELETE": {
            const { _id, role } = await auth(req, res);
            const db = await getDB();
            const classes = db.collection("classes");
            if (role !== "student") {
                const r = await classes.deleteOne({ _id: new ObjectId(req.body.class_id), member_ids: _id });
                //req.body.member_ids.forEach(m => io.in(m).emit("/notify/classes/delete", req.body.class_id, true));
                didUpdate(res, r.deletedCount);
            } else {
                forbidden(res);
            }
            break;
        }
        /*case "PUT": {
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
        }*/
        case "GET": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const classes = db.collection("classes");
            if (req.query._id) {
                console.log(req.query._id);
                if (!ObjectId.isValid(req.query._id as string)) {
                    errors(res, "Class not found.");
                    break;
                }
                
                const Class = await classes.findOne({ _id: new ObjectId(req.query._id as string), member_ids: _id });
                Class ? res.json(Class) : errors(res, "Class not found.");
            } else {
                const list = await classes.find({ member_ids: _id }).toArray();
                res.json(list);
            }
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});