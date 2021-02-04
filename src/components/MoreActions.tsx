import React, { memo, useState } from "react";
import { IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import isEqual from "react-fast-compare";
import { useRouter } from "next/router";
import Link from "next/link";
import { mdiDotsHorizontal } from "@mdi/js";
import Icon from "./Icon";
import { RootState } from "../redux/store";

const Actions = memo(({ actions }: any) => actions.map(a => (
    <MenuItem key={a.label} onClick={a.fn}>
        {a.label}
    </MenuItem>
)), (prev, next: any) => isEqual(prev, next) || next.actions === null);
//const history = typeof(History) === "undefined" ? {} : new History();
export default memo(({ className }: { className: string }) => {
    const
        [open, setOpen] = useState(false),
        exec = (fn: () => void) => () => {
            setOpen(false);
            fn();
        },
        moreActions = useSelector((s: RootState) => s.moreActions),
        dispatch = useDispatch(),
        openHelp = () => dispatch({
            type: "OPEN_HELP_DIALOG",
            payload: "Some text",
        }),
        router = useRouter();
    return (
        <>
            <Tooltip title="More Options">
                <IconButton
                    className={className}
                    onClick={() => setOpen(true)}
                    color="inherit"
                >
                    <Icon path={mdiDotsHorizontal} />
                </IconButton>
            </Tooltip>
            <Menu
                anchorReference="none"
                keepMounted
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    className: "more_actions"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Actions actions={moreActions.actions.map(a => ({ ...a, fn: exec(a.fn) }))} />
                <MenuItem onClick={process.browser ? exec(router.back) : undefined}>Back</MenuItem>
                <MenuItem onClick={process.browser ? exec(window.history.forward) : undefined}>Forward</MenuItem>
                <MenuItem onClick={openHelp}>Help</MenuItem>
                <Link href="/feedback">
                    <MenuItem onClick={() => setOpen(false)}>Feedback</MenuItem>
                </Link>
                <MenuItem onClick={exec(() => {router.replace(router.asPath)})}>
                    Refresh Page
                </MenuItem>
            </Menu>
        </>
    );
});