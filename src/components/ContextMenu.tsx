/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo } from "react";
import { Menu, Divider, ListItemText, ListItemIcon, MenuItem, SwipeableDrawer, MenuList } from "@material-ui/core";
import { ContextMenuItem } from "../types/contextMenu";
import styles from "../css/contextMenu.module.css";

interface IProps {
    items: ContextMenuItem[];
    mouse: [number, number];
    close(): void;
    isMobile: boolean;
}

function Items({ items, close }: Pick<IProps, "items" | "close">) {
    return (
        <>
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
        </>
    );
}

function MobileContextMenu({ items, close, open }: Pick<IProps, "items" | "close"> & { open: boolean }) {
    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={close}
            onOpen={undefined}
            disableDiscovery
            classes={{
                paper: styles.mobile_menu,
            }}
        >
            <Items items={items} close={close} />
        </SwipeableDrawer>
    );
}

function DesktopContextMenu({ items, mouse, close }: Omit<IProps, "isMobile">) {
    return (
       <Menu
            keepMounted
            open={mouse !== null}
            onClose={close}
            anchorReference={"anchorPosition"}
            anchorPosition={mouse !== null
                ? { top: mouse[1], left: mouse[0] }
                : undefined
            }
            PaperProps={{
                className: styles.contextMenu,
                onContextMenu: e => e.preventDefault(),
            }}
            PopoverClasses={{
                root: styles.popover,
            }}
            BackdropProps={{
                onContextMenu: close,
                invisible: true,
            }}
        >
            <Items items={items} close={close} />
        </Menu>
    );
}

function ContextMenu({ items, mouse, close, isMobile }: IProps) {
    return isMobile ? <MobileContextMenu items={items} close={close} open={mouse !== null} /> : <DesktopContextMenu items={items} mouse={mouse} close={close} />;
}

export default memo(ContextMenu);