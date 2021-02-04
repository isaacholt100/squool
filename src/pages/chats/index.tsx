import { Button, Hidden, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, TextField, Tooltip, useMediaQuery } from "@material-ui/core";
import { mdiDotsHorizontalCircle } from "@mdi/js";
import Link from "next/link";
import { useRouter } from "next/router";
import Icon from "../../components/Icon";
import useContextMenu from "../../hooks/useContextMenu";
import { defaultRedirect } from "../../lib/serverRedirect";
import styles from "../../css/chats.module.css";
import clsx from "clsx";

interface IChat {

}

interface ISideBarProps {
    list: IChat[];
    chat_id: string;
    isSmall: boolean;
}

function SideBar(props: ISideBarProps) {
    const
        [ContextMenu, openContextMenu] = useContextMenu(),
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
    return (
        <>
            <div className={styles.sidebar_root}>
                <Paper className={clsx("p_6 pb_0 flex flex_col", styles.list_container)} style={props.isSmall && props.chat_id ? {display: "none"} : {}}>
                    <Button color="secondary" fullWidth className="mb_6">
                        New Chat
                    </Button>
                    <TextField
                        placeholder="Search"
                        className="mb_6"
                    />
                    <List component="nav" aria-label="chat list" className="overflow_scroll flex_1">
                        {props.list.map((chat, i) => (
                            <Link href="?id=345">
                                <ListItem button selected={i === 4} onContextMenu={openMenu(chat)}>
                                    <ListItemText primary="Inbox" />
                                    <ListItemSecondaryAction onClick={openMenu(chat)}>
                                        <Tooltip title="Actions" placement="right">
                                            <IconButton edge="end" aria-label="more actions" size="small" className={i === 4 ? "primary_contrast_text" : undefined}>
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
        isSmall = useMediaQuery("(max-width:680px)");
    return (
        <div className="flex">
            <SideBar list={Array(12).fill(undefined)} chat_id={chat_id} isSmall={isSmall} />
        </div>
    );
}
export const getServerSideProps = defaultRedirect;