import { NextApiRequest, NextApiResponse } from "next";
import { notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";
import updateSettings from "../../../../server/updateSettings";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            if (["theme.primary", "theme.secondary", "theme.type", "theme.fontFamily", "theme"].includes(req.body.path)) {
                await updateSettings(req, res, {
                    [req.body.path]: req.body.val,
                });
            } else {
                throw new Error("Invalid theme path");
            }
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});