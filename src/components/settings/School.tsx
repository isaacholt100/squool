import React, { memo, useState } from "react";
import useRequest from "../../hooks/useRequest";
import useSnackbar from "../../hooks/useSnackbar";
import useConfirm from "../../hooks/useConfirm";
import { Typography, TextField, Button } from "@material-ui/core";
import MarginDivider from "../MarginDivider";
import useCookies from "../../hooks/useCookies";
export default memo(() => {
    const
        request = useRequest(),
        snackbar = useSnackbar(),
        cookies = useCookies(),
        confirm = useConfirm(),
        [state, setState] = useState({
            _id: "",
            helper: "",
        }),
        change = () => {
            request.put("/user/school", {
                failedMsg: "updating your school",
                body: { school_id: state._id },
                done: data => {
                    setState({
                        helper: "",
                        _id: "",
                    });
                    snackbar.success("School updated");
                },
                errors: data =>  setState({
                    ...state,
                    helper: data.errors as string,
                })
            });
            /*request("/user/school", "PUT", false, data => {
                setState({
                    ...state,
                    _id: "",
                });
                showSnackbar("School updated", {
                    variant: "success",
                });
            }, "updating your school", {
                school_id: state._id, 
            }, data => {
                setState({
                    ...state,
                    helper: data.errors,
                });
            });*/
        },
        submit = e => {
            e.preventDefault();
            if (state._id !== "") {
                if (cookies.exists("school_id")) {
                    confirm("change your school? You'll leave all your classes.", change);
                } else if (state._id === cookies.get("school_id")) {
                    setState({
                        ...state,
                        _id: "",
                    });
                } else {
                    change();
                }
            }
        };
    return (
        <form onSubmit={submit}>
            <Typography variant="h6" gutterBottom>
                School
            </Typography>
            <TextField
                value={state._id}
                variant="outlined"
                label="New school ID"
                onChange={e => setState({ _id: e.target.value, helper: "" })}
                error={state.helper !== ""}
                helperText={state.helper + " "}
                fullWidth
            />
            <Button
                color="secondary"
                type="submit"
            >
                Change
            </Button>
            <MarginDivider />
        </form>
    );
});