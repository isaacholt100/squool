import { NextApiRequest, NextApiResponse } from "next";
import getDB from "./getDB";
import auth from "./auth";
import argon2 from "argon2";
import { errors } from "./helpers";

export default async (req: NextApiRequest, res: NextApiResponse, success: (() => Promise<void>) | (() => void)) => {
    const { _id } = await auth(req, res);
    const db = await getDB();
    const users = db.collection("users");
    const userPassword = (await users.findOne({ _id }, {
        projection: {
            password: 1,
            _id: 0,
        }
    }))?.password;
    if (!userPassword || typeof(req.body.password) !== "string" || !(await argon2.verify(userPassword, req.body.password))) {
        errors(res, "Password is incorrect");
    } else {
        await success();
    }
}