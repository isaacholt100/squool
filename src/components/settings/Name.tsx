import { TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { usePut } from "../../hooks/useRequest";
import useUserInfo from "../../hooks/useUserInfo";
import { dispatch } from "../../redux/store";
import LoadBtn from "../LoadBtn";

export default function Name(props: { firstName: string, lastName: string }) {
    const { firstName, lastName } = useUserInfo();
    const [put, loading] = usePut();
    const [first, setFirst] = useState(firstName || props.firstName);
    const [last, setLast] = useState(lastName || props.lastName);
    const firstErr = first.length > 50;
    const lastErr = last.length > 50;
    const updateName = e => {
        e.preventDefault();
        if (!loading) {
            put("/user/name", {
                setLoading: true,
                body: {
                    firstName: first,
                    lastName: last,
                },
                doneMsg: "Name updated",
                failedMsg: "updating your name",
                done() {
                    dispatch({
                        type: "/user/info/update",
                        payload: {
                            firstName: first,
                            lastName: last,
                        }
                    });
                }
            });
        }
    }
    useEffect(() => {
        firstName && setFirst(firstName);
    }, [firstName]);
    useEffect(() => {
        lastName && setLast(lastName);
    }, [lastName]);
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Name
            </Typography>
            <form onSubmit={updateName}>
                <TextField
                    value={first}
                    onChange={e => setFirst(e.target.value)}
                    label={"First Name"}
                    fullWidth
                    helperText={firstErr ? "Name too long" : " "}
                    error={firstErr}
                    style={{
                        width: "calc(50% - 4px)",
                        marginRight: 6,
                    }}
                />
                <TextField
                    value={last}
                    onChange={e => setLast(e.target.value)}
                    label={"Last Name"}
                    fullWidth
                    helperText={lastErr ? "Name too long" : " "}
                    error={lastErr}
                    style={{
                        width: "calc(50% - 4px)",
                    }}
                />
                <LoadBtn label="Update Name" loading={loading} disabled={firstErr || lastErr} />
            </form>
        </>
    );
}