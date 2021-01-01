/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo } from "react";
import { Menu, Divider, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { ContextMenuItem } from "../types/contextMenu";
import styles from "../css/contextMenu.module.css";

interface IProps {
    items: ContextMenuItem[];
    mouse: [number, number];
    close(): void;
}

function ContextMenu({ items, mouse, close }: IProps) {
    return (
       <Menu
            keepMounted
            open={mouse[0] !== null}
            onClose={close}
            anchorReference="anchorPosition"
            anchorPosition={mouse[0] !== null && mouse[1] !== null
                ? { top: mouse[1], left: mouse[0] }
                : undefined
            }
            PaperProps={{
                className: styles.contextMenu,
            }}
            MenuListProps={{
                className: "p_0"
            }}
            PopoverClasses={{
                root: styles.popover,
            }}
            BackdropProps={{
                invisible: true,
                onContextMenu: close,
            }}
        >
            {items.map((item, i) => item === "divider" ? <Divider key={i} /> : (
                <ListItem {...item as any} onClick={() => {item.fn(); close();}} key={i} button className={styles.listItem}>
                    <ListItemIcon className={styles.icon}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                </ListItem>
            ))}
        </Menu>
    );
}

export default memo(ContextMenu);