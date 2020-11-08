import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { done, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const books = db.collection("books");
            const
                { name, class_id } = req.body,
                d = new Date(),
                year = d.getUTCFullYear(),
                period = d.getUTCMonth() > 8
                    ? `${year} - ${year + 1}`
                    : `${year - 1} - ${year}`;
            const r = await books.insertOne({ name, class_id: class_id ? new ObjectId(class_id) : null, period, owner_id: _id, comments: [], teacher_ids: [] });
            res.json({
                book_id: r.insertedId,
                period,
            });
            break;
        }
        case "DELETE": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const books = db.collection("books");
            await books.deleteOne({ _id: new ObjectId(req.body.book_id), owner_id: _id });
            done(res);
            break;
        }
        case "PUT": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const books = db.collection("books");
            await books.updateOne({ _id: new ObjectId(req.body.book_id), $or: [{owner_id: _id}, {teacher_ids: _id }] }, {
                $set: {
                    content: req.body.content,
                    lastEdited: new Date().toDateString(),
                },
            });
            done(res);
            break;
        }
        case "GET": {
            const { _id, role } = await auth(req, res);
            const db = await getDB();
            const books = db.collection("books");
            const book = await books.findOne({ _id: new ObjectId(req.query._id as string), $or: [{owner_id: _id }, {teacher_ids: _id }] });
            res.json(book ? {
                ...book,
                type: role,
            } : null);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});