import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { Role } from "../types/IUser";

export interface IUSer {
    _id: ObjectId;
    school_id: ObjectId;
    role: Role;
}
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const accessHeader = req.headers["authorization"];
    let token: IUSer;
    if (!accessHeader) {
        console.log("no accessHeader");
        
        throw new Error("401");
    }
    try {
        const accessToken = accessHeader.split(" ")[1];
        if (!accessToken) {
            console.log("no accessToken");
            
            throw new Error("401");
        }
        jwt.verify(accessToken, `${process.env.ACCESS_TOKEN}`, (err, user: IUSer) => {
            if (err || !user) {
                if (err.name === "TokenExpiredError") {
                    const refreshHeader = req.headers["authorization-refresh"] as string;
                    if (!refreshHeader) {
                        console.log("no refreshHeader");
                        
                        throw new Error("401");
                    }
                    const refreshToken = refreshHeader.split(" ")[1];
                    if (req.cookies.httpRefreshToken !== refreshToken || !refreshToken) {
                        console.log("no refreshToken");
                        
                        throw new Error("401");
                    }
                    const payload = jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN}`) as IUSer;
                    if (!payload || (user && user._id !== payload._id)) {
                        console.log("access and refresh not equal");
                        
                        throw err;
                    }
                    const jwtInfo: IUSer = {
                        _id: payload._id,
                        school_id: payload.school_id,
                        role: payload.role,
                    }
                    res.setHeader("authorization", jwt.sign(jwtInfo, process.env.ACCESS_TOKEN, {
                        expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME,
                    }));
                    token = {
                        role: payload.role,
                        _id: new ObjectId(payload._id),
                        school_id: payload.school_id ? new ObjectId(payload.school_id) : null,
                    };
                } else {
                    throw err;
                }
            } else {
                token = {
                    role: user.role,
                    school_id: user.school_id ? new ObjectId(user.school_id) : null,
                    _id: new ObjectId(user._id),
                };
            }
        });
    } catch (err) {
        throw new Error("401");
    }
    return token;
}