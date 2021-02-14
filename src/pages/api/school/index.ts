import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { errors, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            
            break;
        }
        case "GET": {
            const { school_id } = await auth(req, res);
            const db = await getDB();
            const schools = db.collection("schools");
            const school = await schools.findOne({ _id: school_id });
            if (school) {
                res.json(school);
            } else {
                errors(res, "School not found");
            }
            break;
        }
        case "DELETE": {
            
            break;
        }
        default: {
            notAllowed(res);
            break;
        }
    }
});