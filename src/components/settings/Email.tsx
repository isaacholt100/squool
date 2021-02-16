import { Button, Divider, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { usePut } from "../../hooks/useRequest";
import useUserInfo from "../../hooks/useUserInfo";
import isEmailValid from "../../lib/isEmailValid";
import { dispatch } from "../../redux/store";
import LoadBtn from "../LoadBtn";

export default function Email({ email: initial }: { email: string }) {
    const { email } = useUserInfo();
    const [put, loading] = usePut();
    const [stateEmail, setStateEmail] = useState(email || initial);
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
                    type="email"
                    autoComplete="email"
                />
                <div className="flex space_between">
                    <LoadBtn color="secondary" label="Update" loading={loading} disabled={error || email === stateEmail} />
                    <Button disabled={email === stateEmail} onClick={() => setStateEmail(email)}>Revert</Button>
                </div>
            </form>
            <Divider className={"my_12"} />
        </>
    );
}