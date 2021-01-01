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

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: theme.palette.primary.main + " !important",
        color: theme.palette.primary.contrastText + " !important",
        height: 64,
        width: 64,
        marginRight: 16,
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
export default memo(({ icon: initial }: { icon: string }) => {
    const
        classes = useStyles(),
        [put, loading] = usePut(),
        icon = useUserInfo().icon ?? initial,
        [enlarged, setEnlarged] = useState(""),
        [open, setOpen] = useState(false),
        change = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            !loading && put("/user/settings/icon", {
                setLoading: true,
                failedMsg: "updating your profile icon",
                body: { icon: enlarged },
                done: () => {
                    setOpen(false);
                    dispatch({
                        type: "/user/info/update",
                        payload: {
                            icon: enlarged,
                        }
                    });
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
                <Avatar className={classes.avatar}>
                    <Icon path={profileIcons[icon] || mdiAccount} size="48px" />
                </Avatar>
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
                            label="Change"
                            disabled={icon === enlarged}
                            loading={loading}
                        />
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
});