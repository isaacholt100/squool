import { NextApiRequest, NextApiResponse } from "next";
import auth from "./auth";
import getDB from "./getDB";
import { done } from "./helpers";

export default async function updateSettings(req: NextApiRequest, res: NextApiResponse, obj: {[key: string]: any}) {
    try {
        const { _id } = await auth(req, res);
        const db = await getDB();
        const users = db.collection("users");
        await users.updateOne({ _id }, {
            $set: obj
        });
        done(res);
    } catch (err) {
        throw err;
    }
}  