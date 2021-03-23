import { NextApiRequest, NextApiResponse } from "next";
import getDB from "../../server/getDB";
import getUser from "../../server/getUser";
import { done, errors, notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";
import jwt from "jsonwebtoken";
import { IUSer } from "../../server/auth";
import { deleteRefreshToken, setRefreshToken } from "../../server/cookies";
import { ObjectId } from "mongodb";
import argon2 from "argon2";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            const
                db = await getDB(),
                users = db.collection("users"),
                { password, /*staySignedIn,*/ email } = req.body,
                isUser = await users.findOne({ email }, { projection: { password: 1 } });
            if (!isUser) {
                errors(res, {
                    emailError: "Email not found",
                });
            } else {
                const valid = await argon2.verify(isUser.password, password);
                if (valid) {
                    const user = await getUser(isUser._id, users);
                    const jwtInfo: IUSer = {
                        role: user.role,
                        _id: user._id,
                        school_id: user.school_id,
                    };
                    const refreshToken = jwt.sign(jwtInfo, process.env.REFRESH_TOKEN);
                    setRefreshToken(res, refreshToken);
                    res.json({
                        ...user,
                        accessToken: jwt.sign(jwtInfo, process.env.ACCESS_TOKEN, {
                            expiresIn: "20s",
                        }),
                        refreshToken,
                    });
                } else {
                    errors(res, {
                        passwordError: "Password is incorrect",
                    });
                }
            }
            break;
        }
        case "GET": {
            if (!ObjectId.isValid(req.cookies.user_id)) {
                res.json(false);
            } else {
                const db = await getDB();
                const users = db.collection("users");
                const user = await users.findOne({ _id: new ObjectId(req.cookies.user_id) }, {
                    projection: {
                        _id: 1,
                        accountModifiedTimestamp: 1,
                    },
                });
                const isLoggedIn = req.cookies.refreshToken && req.cookies.httpRefreshToken && req.cookies.accessToken && req.cookies.loginTimestamp && (user.accountModifiedTimestamp === undefined || +req.cookies.loginTimestamp > user.accountModifiedTimestamp);
                
                res.json(isLoggedIn);
            }
            break;
        }
        case "DELETE": {
            deleteRefreshToken(res);
            done(res);
            break;
        }
        default: {
            notAllowed(res);
            break;
        }
    }
});