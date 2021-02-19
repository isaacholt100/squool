import React, { memo, useState, useRef, useEffect } from "react";
import { useDelete } from "../../hooks/useRequest";
import useConfirm from "../../hooks/useConfirm";
//import socket from "../../api/socket";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@material-ui/core";
import LoadBtn from "../LoadBtn";
import useLogout from "../../hooks/useLogout";
import useUserInfo from "../../hooks/useUserInfo";
import BtnLink from "../BtnLink";
import { useRouter } from "next/router";

export default memo(() => {
    const
        router = useRouter(),
        [del, loading] = useDelete(),
        logoutDone = useLogout(),
        [ConfirmDialog, confirm] = useConfirm(loading),
        [passwordState, setPasswordState] = useState({
            confirmPassword: "",
            confirmPasswordError: "",
        }),
        [state, setState] = useState({
            deleteDialogOpen: false,
            deleteDisabled: true,
        }),
        { role } = useUserInfo(),
        timer = useRef<NodeJS.Timeout>(),
        logout = () => {
            del("/login", {
                setLoading: true,
                done: logoutDone,
            });
        },
        openDeleteDialog = () => {
            setState({
                ...state,
                deleteDialogOpen: true,
                deleteDisabled: true,
            });
            setPasswordState({
                ...passwordState,
                confirmPassword: "",
                confirmPasswordError: "",
            });
            timer.current = setTimeout(() => {
                setState({
                    ...state,
                    deleteDisabled: false,
                    deleteDialogOpen: true,
                });
            }, 10000);
        },
        closeDeleteDialog = () => {
            setState({
                ...state,
                deleteDialogOpen: false,
                deleteDisabled: true,
            });
            setPasswordState({
                confirmPassword: "",
                confirmPasswordError: "",
            });
            clearTimeout(timer.current);
        },
        deleteAccount = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!state.deleteDisabled && passwordState.confirmPassword !== "") {
                del("/user", {
                    setLoading: true,
                    failedMsg: "deleting your account",
                    body: { password: passwordState.confirmPassword },
                    done: logoutDone,
                    errors: data => setPasswordState({
                        ...passwordState,
                        confirmPasswordError: data.errors as string,
                    })
                });
            }
        },
        confirmLogout = () => {
            router.prefetch("/login");
            confirm("logout?", logout);
        };
    useEffect(() => {
        return () => clearTimeout(timer.current);
    }, []);
    return (
        <>
            <div className={"flex"}>
                <Button
                    variant="contained"
                    color="default"
                    onClick={confirmLogout}
                >
                    Log out
                </Button>
                <Button
                    variant="contained"
                    className={"ml_auto error_color_btn"}
                    onClick={openDeleteDialog}
                >
                    Delete Account
                </Button>
            </div>
            {ConfirmDialog}
            <Dialog
                open={state.deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Are you sure you want to delete your account? You'll lose it forever!</DialogTitle>
                {role === "owner" ? (
                    <>
                        <DialogContent>
                            <DialogContentText>
                                You're the owner of the your school, so to delete your account you must first transfer ownership of the school to another admin in your school. This can be done in{" "}
                                <BtnLink href="/school#settings" label="School Settings" />
                                .
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeDeleteDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                ) : (
                    <form onSubmit={deleteAccount}>
                        <DialogContent>
                            <DialogContentText>
                                To prevent accidentally deleting your account and to give you time to think whether you really want to, the delete button will be disabled for 10 seconds. <br />
                                You must enter your password to continue:
                            </DialogContentText>
                            <TextField
                                value={passwordState.confirmPassword}
                                onChange={e => setPasswordState({...passwordState, confirmPassword: e.target.value, confirmPasswordError: ""})}
                                label="Password"
                                variant="outlined"
                                error={passwordState.confirmPasswordError !== ""}
                                helperText={passwordState.confirmPasswordError + " "}
                                fullWidth
                                type="password"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeDeleteDialog} color="default" autoFocus disabled={loading}>
                                cancel
                            </Button>
                            <LoadBtn
                                label="Delete Account"
                                disabled={state.deleteDisabled || passwordState.confirmPassword === "" || passwordState.confirmPasswordError !== ""}
                                className={"error_color_btn"}
                                loading={loading}
                            />
                        </DialogActions>
                    </form>
                )}
            </Dialog>
        </>
    );
});