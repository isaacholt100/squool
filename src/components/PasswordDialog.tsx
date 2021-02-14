import React, { useState } from "react";
import { Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, Button, TextField } from "@material-ui/core";
import LoadBtn from "./LoadBtn";

export default function ConfirmDialog({ loading, fn, close }: { loading: boolean,fn: (password: string, setError: () => void) => void, close: () => void }) {
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);
    return (
        <Dialog
            open={fn !== null}
            onClose={close}
            aria-labelledby="confirm-action"
            aria-describedby="confirm-description"
        >
            <DialogTitle id="confirm-action">Authentication Required</DialogTitle>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    !loading && fn(value, () => setError(true));
                }}
            >
                <DialogContent>
                    <DialogContentText id="confirm-description" gutterBottom>
                        Your password is required to perform this action.
                    </DialogContentText>
                    <TextField
                        type="password"
                        autoComplete="current-password"
                        label="Password"
                        name="password-authentication"
                        id="password-authentication"
                        value={value}
                        onChange={e => {
                            setError(false);
                            setValue(e.target.value);
                        }}
                        autoFocus
                        fullWidth
                        error={error}
                        helperText={error ? "Password is incorrect" : " "}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} color="default" disabled={loading}>
                        Cancel
                    </Button>
                    <LoadBtn loading={loading} label="Confirm" disabled={error || value === ""} />
                </DialogActions>
            </form>
        </Dialog>
    );
}