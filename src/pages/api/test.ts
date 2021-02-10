import tryCatch from "../../server/tryCatch";

export default (_req, res) => tryCatch(res, async () => {
    //const user = await auth(req, res);
    res.json({
        hi: new Date(),
    })
});