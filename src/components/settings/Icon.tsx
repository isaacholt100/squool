import React, { memo, useState } from "react";
import { usePut } from "../../hooks/useRequest";
//import { dispatchEmit } from "../../api/socketDispatch";
import { Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, ButtonBase, DialogActions, makeStyles } from "@material-ui/core";
import MarginDivider from "../MarginDivider";
import { mdiAccount } from "@mdi/js";
import profileIcons from "../../json/profileIcons";
import LoadBtn from "../LoadBtn";
import Icon from "../Icon";
import clsx from "clsx";
import { dispatch } from "../../redux/store";
import useUserInfo from "../../hooks/useUserInfo";
import LargeAvatar from "../LargeAvatar";
import { mutate } from "swr";

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: theme.palette.primary.main + " !important",
        color: theme.palette.primary.contrastText + " !important",
        height: 64,
        width: 64,
        marginRight: 12,
    },
    iconOption: {
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.secondary.main,
        margin: 2,
        border: 2,
        borderStyle: "solid",
    },
    iconOptionSelected: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        border: 0,
    }
}));
export default memo(() => {
    const
        classes = useStyles(),
        [put, loading] = usePut(),
        { icon } = useUserInfo(),
        [enlarged, setEnlarged] = useState(""),
        [open, setOpen] = useState(false),
        change = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            !loading && put("/user/settings/icon", {
                setLoading: true,
                failedMsg: "updating your profile icon",
                doneMsg: "Profile icon updated",
                body: { icon: enlarged },
                done: () => {
                    setOpen(false);
                    mutate("/api/user?info", user => ({
                        ...user,
                        icon: enlarged,
                    }), false);
                    /*dispatchEmit("/user/info/update", {
                        icon: enlarged,
                    });*/
                },
            });
        };
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Profile Icon
            </Typography>
            <div className={"flex align_items_center"}>
                <LargeAvatar icon={icon} className={"mr_12"} />
                <Button
                    color="secondary"
                    onClick={() => {
                        setEnlarged(icon);
                        setOpen(true);
                    }}
                >
                    Change
                </Button>
            </div>
            <MarginDivider />
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="change-icon"
                maxWidth="md"
            >
                <form onSubmit={change}>
                    <DialogTitle id="change-icon">Profile Icon</DialogTitle>
                    <DialogContent>
                        <div className={"flex flex_wrap"}>
                            {Object.keys(profileIcons).map(p => (
                                <Avatar
                                    component={ButtonBase}
                                    onClick={() => setEnlarged(p)}
                                    key={p}
                                    className={clsx(classes.iconOption, enlarged === p && classes.iconOptionSelected)}
                                >
                                    <Icon path={profileIcons[p]} />
                                </Avatar>
                            ))}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                        <LoadBtn
                            label="Update Icon"
                            disabled={icon === enlarged}
                            loading={loading}
                        />
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
});