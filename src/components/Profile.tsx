import { Chip, Typography } from "@material-ui/core";
import { mdiAt } from "@mdi/js";
import { startCase } from "lodash";
import useUserInfo from "../hooks/useUserInfo";
import { getFullName } from "../lib/userName";
import IUser from "../types/IUser";
import Icon from "./Icon";
import LargeAvatar from "./LargeAvatar";

export default function Profile({ user }: { user: IUser }) {
    const isLoggedInUser = useUserInfo()._id === user._id;
    return (
        <div>
            <div className="flex align_items_center flex_wrap">
                <LargeAvatar icon={user.icon} className="mr_12" />
                <Typography variant="h4">
                    {getFullName(user) + (isLoggedInUser ? " (You)" : "")}
                </Typography>
            </div>
            <Typography color="textSecondary" variant="h6" className="flex align_items_center my_12">
                <Icon path={mdiAt} size="32px" className="mr_6" />
                {user.email}
            </Typography>
            <Chip label={startCase(user.role)} color="secondary" />
        </div>
    );
}