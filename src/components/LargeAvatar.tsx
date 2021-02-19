import { Avatar, AvatarProps } from "@material-ui/core";
import { mdiAccount } from "@mdi/js";
import profileIcons from "../json/profileIcons";
import Icon from "./Icon";
import styles from "../css/largeAvatar.module.css";

export default function LargeAvatar({ icon, ...other }: { icon: string } & AvatarProps) {
    return (
        <Avatar {...other} className={styles.avatar + " primary_bg primary_contrast_text " + (other.className || "")}>
            <Icon path={profileIcons[icon] || mdiAccount} size="48px" />
        </Avatar>
    );
}