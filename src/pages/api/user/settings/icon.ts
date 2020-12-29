import { NextApiRequest, NextApiResponse } from "next";
import { notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";
import updateSettings from "../../../../server/updateSettings";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            await updateSettings(req, res, {
                icon: req.body.icon,
            });
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});