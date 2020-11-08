import { NextApiRequest, NextApiResponse } from "next";
import isEmailValid from "../../../lib/isEmailValid";
import { notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";
import updateSettings from "../../../server/updateSettings";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            if (!isEmailValid(req.body.email)) {
                throw new Error("400");
            }
            await updateSettings(req, res, {
                email: req.body.email,
            });
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});