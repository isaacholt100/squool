import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { done, errors, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "DELETE": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const books = db.collection("books");
            await books.updateOne({ owner_id: _id, _id: new ObjectId(req.body.book_id) }, {
                $set: {
                    class_id: null,
                    teacher_ids: [],
                },
            });
            done(res);
            break;
        }
        case "PUT": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const books = db.collection("books");
            const classes = db.collection("classes");
            if (await books.countDocuments({ owner_id: _id, class_id: new ObjectId(req.body.class_id) }) > 0) {
                errors(res, {
                    classNameError: "You already have another book linked to this class",
                });
            } else {
                const classInfo = await classes.findOne({ _id: new ObjectId(req.body.class_id) }, { projection: { teacher_ids: 1 }});
                await books.updateOne({ owner_id: _id, _id: new ObjectId(req.body.book_id) }, {
                    $set: {
                        class_id: req.body.class_id,
                        teacher_ids: classInfo ? classInfo.teacher_ids : [],
                    },
                });
                done(res);
            }
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});