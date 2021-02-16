import { Button, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { usePut } from "../../hooks/useRequest";
import useUserInfo from "../../hooks/useUserInfo";
import { dispatch } from "../../redux/store";
import LoadBtn from "../LoadBtn";

export default function Name(props: { firstName: string, lastName: string }) {
    const
        { firstName, lastName, role } = useUserInfo(),
        [put, loading] = usePut(),
        [first, setFirst] = useState(firstName || props.firstName),
        [last, setLast] = useState(lastName || props.lastName),
        firstErr = first.length > 50,
        lastErr = last.length > 50,
        disabled = firstErr || lastErr || first === "" || last === "" || (first === firstName && last === lastName),
        updateName = e => {
            e.preventDefault();
            if (!loading && !disabled) {
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
        },
        revertFields = () => {
            setFirst(firstName);
            setLast(lastName);
        };
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
                    label={role === "student" ? "First Name" : "Title"}
                    fullWidth
                    helperText={firstErr ? "Name too long" : " "}
                    error={firstErr}
                    style={{
                        width: "calc(50% - 3px)",
                        marginRight: 6,
                    }}
                    autoComplete={role === "student" ? "given-name" : "honorific-prefix"}
                />
                <TextField
                    value={last}
                    onChange={e => setLast(e.target.value)}
                    label={"Last Name"}
                    fullWidth
                    helperText={lastErr ? "Name too long" : " "}
                    error={lastErr}
                    style={{
                        width: "calc(50% - 3px)",
                    }}
                    autoComplete="family-name"
                />
                <div className="flex space_between">
                    <LoadBtn label="Update Name" color="secondary" loading={loading} disabled={disabled} />
                    <Button disabled={first === firstName && last === lastName} onClick={revertFields}>Revert</Button>
                </div>
            </form>
        </>
    );
}