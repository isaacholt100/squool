import { Button, Card, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import LoadBtn from "../components/LoadBtn";
import Title from "../components/Title";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { usePut } from "../hooks/useRequest";
import styles from "../css/form.module.css";
import MarginDivider from "../components/MarginDivider";
import BtnLink from "../components/BtnLink";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";

export default dynamic({
    loader: async () => {
        const { validate_password } = await import("wasm");
        return function ResetPassword() {
            const
                [isLoggedIn] = useAuthRedirect(),
                router = useRouter(),
                [password, setPassword] = useState(""),
                [repeat, setRepeat] = useState(""),
                [put, loading] = usePut(),
                passwordHelper = password ? validate_password(password) : "",
                disabled = !password || repeat !== password || passwordHelper !== "",
                [done, setDone] = useState(false),
                submit = e => {
                    e.preventDefault();
                    if (!loading && !disabled) {
                        put("/resetpassword", {
                            setLoading: true,
                            body: {
                                email: router.query.email,
                                token: router.query.token,
                                password,
                            },
                            done() {
                                setDone(true);
                            },
                            failedMsg: "resetting your password",
                        });
                    }
                };
            return (
                <>
                    <Title title="Forgot Password" />
                    {isLoggedIn ? null : (
                        <div>
                            <Card className={"mx_auto " + styles.maxwidth_600}>
                                <Typography variant="h5" gutterBottom>
                                    Reset Password
                                </Typography>
                                {done ? (
                                    <>
                                        <Typography gutterBottom>
                                            You're password has successfully been reset. To be safe, we've logged you out of all your devices.
                                        </Typography>
                                        <Link href="/login">
                                            <Button color="primary">
                                                Login
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <form onSubmit={submit} noValidate>
                                        <TextField
                                            id="new-password"
                                            name="new-password"
                                            required
                                            label="New Password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            autoComplete="new-password"
                                            fullWidth
                                            autoFocus
                                            type="password"
                                            className="my_6"
                                            helperText={passwordHelper + " "}
                                            error={passwordHelper !== ""}
                                        />
                                        <TextField
                                            id="repeat-password"
                                            name="repeat-password"
                                            required
                                            label="Repeat Password"
                                            value={repeat}
                                            onChange={e => setRepeat(e.target.value)}
                                            autoComplete="new-password"
                                            fullWidth
                                            type="password"
                                            className="my_6"
                                            helperText={repeat && repeat !== password ? "Passwords must match" : " "}
                                            error={repeat !== "" && repeat !== password}
                                        />
                                        <LoadBtn label="Change Password" disabled={disabled} loading={loading} />
                                    </form>
                                )}
                            </Card>
                        </div>
                    )}
                </>
            );
        }
    }
});