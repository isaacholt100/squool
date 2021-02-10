import { Box, Button, Hidden, IconButton, InputAdornment, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, TextField, Tooltip, Typography, useMediaQuery } from "@material-ui/core";
import { mdiClose, mdiDotsHorizontalCircle } from "@mdi/js";
import Link from "next/link";
import { useRouter } from "next/router";
import Icon from "../../components/Icon";
import useContextMenu from "../../hooks/useContextMenu";
import { defaultRedirect } from "../../lib/serverRedirect";
import styles from "../../css/chats.module.css";
import clsx from "clsx";
import useRedirect from "../../hooks/useRedirect";
import { useEffect, useState } from "react";

interface IChat {

}

interface ISideBarProps {
    list: IChat[];
    currentId: string;
    setCurrentId(id: string): void;
    hidden: boolean;
}

function SideBar(props: ISideBarProps) {
    const
        [ContextMenu, openContextMenu] = useContextMenu(),
        [search, setSearch] = useState(""),
        openMenu = (chat: IChat) => openContextMenu([{
            label: "test",
            fn() {}
        }, {
            label: "test",
            fn() {}
        }, {
            label: "test",
            fn() {}
        }]);
        console.log(props.hidden);
        
    return (
        <>
            <div className={styles.sidebar_root} style={{display: props.hidden ? "none" : undefined}}>
                <Paper className={clsx("p_6 pb_0 flex flex_col", styles.list_container)}>
                    <Button color="secondary" fullWidth className="mb_6">
                        New Chat
                    </Button>
                    <TextField
                        placeholder="Search"
                        className="mb_6"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton size="small" aria-label="clear search field" className="p_3" onMouseDown={e => e.preventDefault()} onClick={() => setSearch("")}>
                                        <Icon path={mdiClose} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <List component="nav" aria-label="chat list" className="overflow_scroll flex_1">
                        {props.list.map((chat, i) => (
                            <Link href={"?id=" + i} key={i}>
                                <ListItem button selected={i.toString() === props.currentId} onClick={() => props.setCurrentId(i.toString())} onContextMenu={openMenu(chat)}>
                                    <ListItemText primary="Inbox" />
                                    <ListItemSecondaryAction onClick={openMenu(chat)}>
                                        <Tooltip title="Actions" placement="right">
                                            <IconButton edge="end" aria-label="more actions" size="small" className={i.toString() === props.currentId ? "primary_contrast_text" : undefined}>
                                                <Icon path={mdiDotsHorizontalCircle} />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </Paper>
            </div>
            {ContextMenu}
        </>
    );
}
export default function Chats() {
    const
        router = useRouter(),
        chat_id = router.query.id as string,
        [currentId, setCurrentId] = useState(chat_id),
        isSmall = useMediaQuery("(max-width:680px)"),
        listHidden = currentId && isSmall,
        isLoggedIn = useRedirect();
        console.log(currentId);
    useEffect(() => {
        chat_id !== currentId && setCurrentId(chat_id);
    }, [chat_id]);
    return !isLoggedIn ? null : (
        <div className="flex">
            <SideBar
                list={Array(12).fill(undefined)}
                currentId={currentId}
                setCurrentId={setCurrentId}
                hidden={listHidden}
            />
            <Box className="flex_1" ml={{md: isSmall ? 0 : 1, lg: 2,}}>
                {!isSmall && !currentId && (
                    <div className="flex align_items_center flex_col">
                        <Typography variant="h6">No chat selected</Typography>
                    </div>
                )}
            </Box>
        </div>
    );
}
export const getServerSideProps = defaultRedirect;