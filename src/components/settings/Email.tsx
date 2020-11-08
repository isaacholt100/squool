import { Divider, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePut } from "../../hooks/useRequest";
import isEmailValid from "../../lib/isEmailValid";
import { dispatch } from "../../redux/store";
import LoadBtn from "../LoadBtn";

export default function Email() {
    const email = useSelector((s: any) => s.userInfo.email);
    const [put, loading] = usePut();
    const [stateEmail, setStateEmail] = useState(email || "");
    const error = !isEmailValid(stateEmail);
    const updateName = e => {
        e.preventDefault();
        if (!loading) {
            put("/user/email", {
                setLoading: true,
                body: {
                    email: stateEmail,
                },
                failedMsg: "updating your email",
                doneMsg: "Email updated",
                done() {
                    dispatch({
                        type: "/user/info/update",
                        payload: {
                            email: stateEmail,
                        }
                    });
                }
            });
        }
    }
    useEffect(() => {
        email && setStateEmail(email);
    }, [email]);
    return (
        <>
            <Typography variant="h6" gutterBottom>Email</Typography>
            <form onSubmit={updateName}>
                <TextField
                    value={stateEmail}
                    onChange={e => setStateEmail(e.target.value)}
                    label={"Email"}
                    helperText={error ? "Email invalid" : " "}
                    error={error}
                    fullWidth
                />
                <LoadBtn label="Update" loading={loading} disabled={error} />
            </form>
            <Divider className={"my_16"} />
        </>
    );
}