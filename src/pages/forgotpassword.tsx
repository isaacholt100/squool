import { Button, Card, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import LoadBtn from "../components/LoadBtn";
import Title from "../components/Title";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { usePut } from "../hooks/useRequest";
import styles from "../css/form.module.css";
import MarginDivider from "../components/MarginDivider";
import BtnLink from "../components/BtnLink";
import Link from "next/link";
import dynamic from "next/dynamic";
import isEmailValid from "../lib/isEmailValid";

export default function ForgotPassword() {
    const
        [isLoggedIn] = useAuthRedirect(),
        [email, setEmail] = useState(""),
        [put, loading] = usePut(),
        error = email !== "" && !isEmailValid(email),
        [done, setDone] = useState(false),
        submit = e => {
            e.preventDefault();
            if (!loading && !error && email) {
                put("/forgotpassword", {
                    setLoading: true,
                    body: {
                        email,
                    },
                    done() {
                        setDone(true);
                    },
                    failedMsg: "sending you a verification email",
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
                            Forgot Password
                        </Typography>
                        {done ? (
                            <Typography>Verification email sent. Please check your inbox and follow the instructions in the email.</Typography>
                        ) : (
                            <>
                                <Typography>
                                    To reset your password please enter your email address used for your account.
                                </Typography>
                                <form onSubmit={submit} noValidate>
                                    <TextField
                                        id="email"
                                        name="email"
                                        required
                                        label="Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        autoComplete="email"
                                        fullWidth
                                        autoFocus
                                        type="email"
                                        className="my_6"
                                        helperText={error ? "Enter a valid email" : " "}
                                        error={error}
                                    />
                                    <LoadBtn label="Submit" disabled={error || email === ""} loading={loading} />
                                </form>
                            </>
                        )}
                        <MarginDivider />
                        <Link href="/login">
                            <Button
                                color="secondary"
                                component="a"
                            >
                                Login
                            </Button>
                        </Link>
                    </Card>
                </div>
            )}
        </>
    );
}