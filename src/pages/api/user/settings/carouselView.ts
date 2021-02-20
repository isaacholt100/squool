import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import getDB from "../../../../server/getDB";
import { notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";
import updateSettings from "../../../../server/updateSettings";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            await updateSettings(req, res, {
                carouselView: req.body.carouselView,
            });
            break;
        }
        case "GET": {
            if (req.cookies.user_id) {
                const db = await getDB();
                const users = db.collection("users");
                const { carouselView } = await users.findOne({ _id: new ObjectId(req.cookies.user_id) }, { projection: { carouselView: 1, _id: 0 }});
                res.json(Boolean(carouselView));
            } else {
                res.json(false);
            }
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});