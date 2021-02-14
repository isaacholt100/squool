/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo } from "react";
import { Menu, Divider, ListItemText, ListItemIcon, MenuItem } from "@material-ui/core";
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
                onContextMenu: e => e.preventDefault(),
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
            autoFocus={false}
        >
            {items.map((item, i) => item === "divider" ? <Divider key={i} /> : (
                <MenuItem {...item as any} onClick={() => {item.fn(); close();}} key={i} button className={styles.listItem}>
                    {item.icon && (
                        <ListItemIcon className={styles.icon}>
                            {item.icon}
                        </ListItemIcon>
                    )}
                    <ListItemText primary={item.label} />
                </MenuItem>
            ))}
        </Menu>
    );
}

export default memo(ContextMenu);