import React, { memo, useState } from "react";
import { useDelete, usePut } from "../../hooks/useRequest";
import useConfirm from "../../hooks/useConfirm";
import { Typography, TextField, Button } from "@material-ui/core";
import MarginDivider from "../MarginDivider";
import useLogout from "../../hooks/useLogout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default memo(() => {
    const
        [put, loading] = usePut(),
        [del, delLoading] = useDelete(),
        logout = useLogout(),
        school_id = useSelector((s: RootState) => s.userInfo.school_id),
        [ConfirmDialog, confirm, close] = useConfirm(loading || delLoading),
        [state, setState] = useState({
            _id: "",
            helper: "",
        }),
        change = () => {
            put("/user/school", {
                failedMsg: "updating your school",
                body: { school_id: state._id },
                setLoading: true,
                done(data) {
                    logout();
                },
                errors(data) {
                    close();
                    setState({
                        ...state,
                        helper: data.errors as string,
                    });
                }
            });
        },
        leave = () => {
            del("/user/school", {
                failedMsg: "leaving your school",
                body: { school_id: state._id },
                setLoading: true,
                done(data) {
                    logout();
                }
            });
        },
        submit = e => {
            e.preventDefault();
            if (state._id !== "") {
                if (state._id === school_id) {
                    setState({
                        ...state,
                        _id: "",
                    });
                } else {
                    confirm("change your school? You'll need to login again.", change);
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
            <div className="flex mt_8">
                <Button
                    color="secondary"
                    type="submit"
                    disabled={state._id === "" || state.helper !== ""}
                >
                    Change
                </Button>
                <Button className="ml_auto" onClick={() => confirm("leave your school? You'll need to login again.", leave)} disabled={!Boolean(school_id)}>
                    Leave School
                </Button>
            </div>
            <MarginDivider />
            {ConfirmDialog}
        </form>
    );
});