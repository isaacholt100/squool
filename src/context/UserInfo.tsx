import { createContext, ReactChild, useContext } from "react";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import Cookies from "js-cookie";
import useRefState from "../hooks/useRefState";
import { useRouter } from "next/router";
import IUser, { Role } from "../types/IUser";

export const DEFAULT_THEME_ROUTES = ["/"];

const initialUserInfo: IUser & { school_id: string } = process.browser ? {
    email: Cookies.get("email"),
    firstName: Cookies.get("firstName"),
    lastName: Cookies.get("lastName"),
    icon: Cookies.get("icon"),
    _id: Cookies.get("user_id"),
    role: Cookies.get("role") as Role,
    school_id: Cookies.get("school_id"),
} : {
    email: "",
    firstName: "",
    lastName: "",
    icon: "",
    _id: "",
    role: "student",
    school_id: "",
};
const UserInfoContext = createContext([initialUserInfo, (info: Partial<IUser & { school_id: string }>) => {}]);

export default function UserInfo({ children }: { children: ReactChild }) {
    const
        [userInfo, setUserInfo] = useRefState(initialUserInfo),
        dispatch = (info: Partial<IUser & { school_id: string }>) => {
            const newUserInfo = {
                ...userInfo.current,
                ...info,
            };
            setUserInfo(newUserInfo);
            for (const key in info) {
                Cookies.set(key, info[key]);
            }
        };
    return (
        <UserInfoContext.Provider value={[userInfo.current, dispatch]}>
            {children}
        </UserInfoContext.Provider>
    );
}
export const useUserInfo = (): [IUser & { school_id: string }, (userInfo: Partial<IUser & { school_id: string }>) => void] => useContext(UserInfoContext) as any;