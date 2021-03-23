import React, { FormEvent, useState } from "react";
import { usePost } from "../hooks/useRequest";
import {
    Typography,
    Divider,
    IconButton,
    Button,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    TextField,
    Box,
    Card,
    Tooltip,
    Link as ButtonLink
} from "@material-ui/core";
import Icon from "../components/Icon";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import Link from "next/link";
import { useTheme } from "../context/Theme";
import LoadBtn from "../components/LoadBtn";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import useAuthRedirect from "../hooks/useAuthRedirect";
import jwtCookies from "../lib/jwtCookies";
import Title from "../components/Title";
import BtnLink from "../components/BtnLink";
import styles from "../css/form.module.css";
import { NextPageContext } from "next";

const initialState = {
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
};

export default function Login({ initialEmail }: { initialEmail: string }) {
    const
        [isLoggedIn, setIsRedirecting] = useAuthRedirect(),
        router = useRouter(),
        [post, loading] = usePost(),
        [, setTheme] = useTheme(),
        [show, setShow] = useState(false),
        [staySignedIn, setStaySignedIn] = useState(true),
        [state, setState] = useState({...initialState, email: initialEmail}),
        dispatch = useDispatch(),
        //socket = useSocket(),
        disabled = state.emailError !== "" || state.passwordError !== "" || state.email === "" || state.password === "",
        toUrl = decodeURIComponent(router.query.to as string),
        handleChange = (name: "email" | "password") => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            setState({
                ...state,
                [name]: e.target.value,
                [`${name}Error`]: e.target.value === "" ? "Field required" : "",
            });
        },
        handleSubmit = (e: FormEvent) => {
            e.preventDefault();
            const email = state.email.trim().toLocaleLowerCase();
            if (!disabled) {
                post("/login", {
                    setLoading: true,
                    failedMsg: "logging you in",
                    body: {
                        email,
                        password: state.password,
                        staySignedIn,
                    },
                    done(data: any) {
                        setIsRedirecting(true);
                        setTheme(data.theme);
                        dispatch({
                            type: "UPLOAD_DATA",
                            payload: data,
                        });
                        jwtCookies({
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken,
                            staySignedIn,
                            userInfo: {
                                user_id: data._id,
                                role: data.role,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                icon: data.icon,
                                email,
                                ...(data.school_id ? {
                                    school_id: data.school_id,
                                } : {}),
                                carouselView: data.carouselView,
                            },
                        });
                        router.replace(toUrl && toUrl[0] === "/" && toUrl.split("?")[0] !== "/login" ? toUrl : "/home");
                        //socket.connect(`http://${serverUrl.split(":5000")[0]}`);
                    },
                    errors(data) {
                        setState({
                            ...state,
                            ...(data as any).errors,
                        });
                    }
                });
            }
        };
    return (
        <>
            <Title title="Login" />
            {isLoggedIn ? null : (
                <div>
                    <Card className={"mx_auto " + styles.maxwidth_600}>
                        <Typography variant="h5" gutterBottom>
                            Login to{" "}
                            <BtnLink href="/" variant="h5" label="Squool" />
                        </Typography>
                        <form onSubmit={handleSubmit} noValidate>
                            <TextField
                                id="email"
                                name="email"
                                required
                                error={state.emailError !== ""}
                                variant="outlined"
                                label="Email"
                                value={state.email}
                                onChange={handleChange("email")}
                                autoComplete="email"
                                helperText={state.emailError + " "}
                                fullWidth
                                autoFocus
                                type="email"
                                className={"my_6"}
                            />
                            <TextField
                                name="password"
                                id="password"
                                required
                                error={state.passwordError !== ""}
                                variant="outlined"
                                type={show ? "text" : "password"}
                                label="Password"
                                value={state.password}
                                onChange={handleChange("password")}
                                autoComplete="current-password"
                                helperText={state.passwordError + " "}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title={(show ? "Hide" : "Show") + " Password"}>
                                                <IconButton
                                                    aria-label="Toggle password visibility"
                                                    onClick={() => setShow(!show)}
                                                    onMouseDown={e => e.preventDefault()}
                                                    className="p_3"
                                                >
                                                    {show ? <Icon path={mdiEyeOff} /> : <Icon path={mdiEye} />}
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <div>
                                <BtnLink href="/forgotpassword" label="Forgot password?" />
                            </div>
                            <FormControlLabel
                                className="mb_6"
                                control={
                                    <Checkbox
                                        checked={staySignedIn}
                                        onChange={e => setStaySignedIn(e.target.checked)}
                                        value="Stay signed in"
                                        color="primary"
                                    />
                                }
                                label="Stay signed in"
                            />
                            <div className={"flex space_between"}>
                                <LoadBtn loading={loading} label="Login" disabled={disabled} />
                                <Button
                                    onClick={() => setState(initialState)}
                                    variant="outlined"
                                    color="primary"
                                >
                                    clear
                                </Button>
                            </div>
                        </form>
                        <Divider className={"my_6"} />
                        <Typography variant="h6" gutterBottom>Don't have an account yet?</Typography>
                        <Link href="/signup">
                            <Button
                                color="secondary"
                                component="a"
                            >
                                Sign up now
                            </Button>
                        </Link>
                    </Card>
                </div>
            )}
        </>
    );
};

export async function getStaticProps(context: NextPageContext) {
    const initialEmail = context?.query?.email || "";
    return {
        props: {
            initialEmail,
        },
    }
}