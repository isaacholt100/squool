import React, { memo } from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText, Box, ListItemProps } from "@material-ui/core";
import { mdiAccount } from "@mdi/js";
import profileIcons from "../json/profileIcons";
import isEqual from "react-fast-compare";
import useUserInfo from "../hooks/useUserInfo";
import Icon from "./Icon";
import Link from "next/link";
import IUser from "../types/IUser";
import { getFullName } from "../lib/userName";

function UserItem({ user, ...props }: { user: IUser } & ListItemProps) {
    const userInfo = useUserInfo();
    return (
        <Link href={"/profile/" + user._id}>
            <ListItem {...props as any} button>
                <ListItemAvatar>
                    <Avatar className="primary_bg primary_contrastText">
                        <Icon path={profileIcons[user.icon] || mdiAccount} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={user._id === userInfo._id ? getFullName(userInfo) + " (You)" : getFullName(user)}
                    secondary={user.email}
                />
            </ListItem>
        </Link>
    );
}

export default memo(UserItem, (prev, next) => isEqual(prev.user, next.user));