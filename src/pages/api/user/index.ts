import { NextApiRequest, NextApiResponse } from "next";
import { didUpdate, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";
import bcrypt from "bcrypt";
import getDB from "../../../server/getDB";
import auth, { IUSer } from "../../../server/auth";
import { InsertOneWriteOpResult, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
//import nodemailer from "nodemailer";
//import cookie from "cookie";
import getUser from "../../../server/getUser";
import { deleteRefreshToken, setRefreshToken } from "../../../server/cookies";
import getSession from "../../../server/getSession";
import isEmailValid from "../../../lib/isEmailValid";
import passwordAuth from "../../../server/passwordAuth";

export const DEFAULT_PERMISSIONS = {
    changeName: 1,
    changeRoles: 1,
    createClasses: 2,
    removeUsers: 1,
};

const saltRounds = 12;
export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            type Errors = Partial<Record<"schoolID" | "repeatPassword" | "password" | "firstName" | "lastName" | "email", string>>;
            const
                db = await getDB(),
                users = db.collection("users"),
                schools = db.collection("schools"), {
                    password,
                    firstName,
                    lastName,
                    role,
                    repeatPassword,
                    //staySignedIn,
                    schoolID,
                    email
                } = req.body,
                isOwner = role === "owner",
                emailCount = await users.countDocuments({email}),
                errors: Errors = {};
            if (!["student", "teacher", "admin", "owner"].includes(role)) {
                throw new Error("400");
            }
            const school_idCount = isOwner || schoolID === ""
                ? 1
                : await schools.countDocuments({
                    _id: ObjectId.isValid(schoolID)
                        ? new ObjectId(schoolID)
                        : ""
                });
            if (schoolID && school_idCount === 0) {
                errors.schoolID = "School not found";
            }
            if (password !== repeatPassword) {
                errors.repeatPassword = "Passwords must match";
            }
            if (password.length < 6) {
                errors.password = "Password must at least 6 characters";
            }
            if (firstName === "") {
                errors.firstName = "Field required";
            }
            if (lastName === "") {
                errors.lastName = "Field required";
            }
            if (!isEmailValid(email)) {
                errors.email = "Email address invalid";
            } else if (emailCount > 0) {
                errors.email = "Email address is already taken";
            }
            if (Object.keys(errors).length === 0) {
                const session = await getSession();
                try {
                    await session.withTransaction(async () => {
                        const hash = await bcrypt.hash(password, saltRounds);
                        const user_id = new ObjectId();
                        const r1 = isOwner
                        ? await schools.insertOne(
                            {
                                admin_id: user_id,
                                name: schoolID,
                                permissions: DEFAULT_PERMISSIONS,
                                roles: {}
                            },
                            { session }
                        )
                        : {
                            insertedCount: 1,
                            insertedId: new ObjectId(schoolID)
                        },
                        r = await users.insertOne({
                            _id: user_id,
                            school_id: r1.insertedId,
                            email,
                            icon: "",
                            role,
                            firstName,
                            lastName,
                            password: hash,
                            theme: {},
                            carouselView: false,
                        }, { session });
                        if (r.insertedCount === 1 && r1.insertedCount === 1) {
                            /*const
                                transporter = nodemailer.createTransport({
                                    service: "gmail",
                                    secure: false,
                                    auth: {
                                        user: "ntf12358@gmail.com",
                                        pass: "15aac805598Magazine"
                                    },
                                    tls: {
                                        rejectUnauthorized: false
                                    }
                                }),
                                mailOptions = {
                                    from: "edyoucate",
                                    to: email,
                                    subject: "Validate edyoucate account",
                                    text: "",
                                    html: `
                                        <div style="background-color: #fff; font-family: Roboto sans-serif">
                                            <h1>
                                                <strong>Welcome to edyoucate!!!</strong>
                                            </h1>
                                            <p>
                                                We're really chuffed you signed up, ${firstName} ${lastName}. There's one more step to go: click on the link below to make sure it"s really you who signed up with this email.
                                            </p>
                                            <a
                                                href="http://localhost:3000"
                                                style="
                                                    background-color: #3f51b5;
                                                    color: #fff;
                                                    padding: 8px 16px;
                                                    font-size: 0.875rem;
                                                    min-width: 64px;
                                                    box-sizing: border-box;
                                                    min-height: 36px;
                                                    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                                                    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
                                                    font-weight: 500;
                                                    line-height: 1.5;
                                                    border-radius: 4px;
                                                    letter-spacing: 0.02857em;
                                                    text-transform: uppercase;
                                                    outline: none;
                                                    cursor: default;
                                                    -webkit-appearance: none;
                                                    -webkit-tap-highlight-color: transparent;
                                                    user-select: none;
                                                "
                                            >
                                                validate account
                                            </a>
                                        </div>
                                    `
                                };*/
                            const jwtInfo: IUSer = {
                                role,
                                _id: r.insertedId,
                                school_id: isOwner ? (r1 as InsertOneWriteOpResult<any>).insertedId : new ObjectId(schoolID),
                            };
                            const refreshToken = jwt.sign(jwtInfo, process.env.REFRESH_TOKEN);
                            setRefreshToken(res, refreshToken);
                            res.json({
                                accessToken: jwt.sign(jwtInfo, process.env.ACCESS_TOKEN, {
                                    expiresIn: "20s",
                                }),
                                refreshToken,
                                user_id: r.insertedId
                            });
                            //transporter.sendMail(mailOptions);
                        } else {
                            throw new Error("");
                        }
                    });
                } catch (err) {
                    throw err;
                } finally {
                    session.endSession();
                }
            } else {
                res.json({
                    errors,
                });
            }
            break;
        }
        case "GET": {
            if (req.query.info) {
                const { _id } = await auth(req, res);
                const user_id = new ObjectId(_id);
                const db = await getDB();
                const users = db.collection("users");
                const user = await users.findOne({ _id: user_id }, { projection: { firstName: 1, lastName: 1, email: 1, icon: 1, _id: 0} });
                res.json(user);
            } else {
                const { _id } = await auth(req, res);
                const db = await getDB();
                const users = db.collection("users");
                const user = await getUser(_id, users);
                if (!user) {
                    throw new Error("User not found");
                }
                res.json(user);
            }
            break;
        }
        case "DELETE": {
            passwordAuth(req, res, async () => {
                const user = await auth(req, res);
                const db = await getDB();
                const users = db.collection("users");
                const r = await users.deleteOne({_id: user._id, role: {$ne: "owner"}});
                deleteRefreshToken(res);
                didUpdate(res, r.deletedCount);
            });
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});