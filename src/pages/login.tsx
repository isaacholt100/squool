import React, { FormEvent, useEffect, useState } from "react";
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

const initialState = {
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
};

export default function Login() {
    const
        isLoggedIn = useAuthRedirect(),
        router = useRouter(),
        [post, loading] = usePost(),
        //request = useRequest(),
        [, setTheme] = useTheme(),
        [show, setShow] = useState(false),
        [staySignedIn, setStaySignedIn] = useState(true),
        [state, setState] = useState(initialState),
        dispatch = useDispatch(),
        //history = useHistory(),
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
                        setTheme(data.theme);
                        dispatch({
                            type: "UPLOAD_DATA",
                            payload: data,
                        });
                        jwtCookies({
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken,
                            staySignedIn,
                            user_id: data._id,
                            school_id: data.school_id,
                            role: data.role,
                        });
                        router.replace(toUrl && toUrl[0] === "/" && toUrl.split("?")[0] !== "/login" ? toUrl : "/home");
                        //socket.connect(`http://${serverUrl.split(":5000")[0]}`);
                    },
                    errors: data => setState({
                        ...state,
                        ...(data as any).errors,
                    })
                });
            }
        };
    return (
        <>
            <Title title="Login" />
            {isLoggedIn ? null : (
                <div>
                    <Box maxWidth={600} mx="auto" /*className={effects.fadeup}*/ component={Card}>
                        <Typography variant="h5" gutterBottom>
                            Login to Squool
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <div className={"my_8"}>
                                <TextField
                                    id="email"
                                    name="email"
                                    required
                                    error={state.emailError !== ""}
                                    variant="outlined"
                                    label="Email"
                                    value={state.email}
                                    onChange={handleChange("email")}
                                    autoComplete="new-email"
                                    helperText={state.emailError + " "}
                                    fullWidth
                                    autoFocus
                                />
                            </div>
                            <div className={"my_8"}>
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
                                    autoComplete="new-password"
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
                                                    >
                                                        {show ? <Icon path={mdiEyeOff} /> : <Icon path={mdiEye} />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <Box clone mt="-8px" mb="4px">
                                <FormControlLabel
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
                            </Box>
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
                        <Divider className={"my_8"} />
                        <Typography variant="h6" gutterBottom>Don't have an account yet?</Typography>
                        <Link href="/signup">
                            <Button
                                color="secondary"
                                component="a"
                            >
                                Sign up now
                            </Button>
                        </Link>
                    </Box>
                </div>
            )}
        </>
    );
};