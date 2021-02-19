import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import IUser, { Role } from "../types/IUser";
import { useUserInfo as useInfo } from "../context/UserInfo";
import useSWR from "swr";
import Cookies from "js-cookie";

export default function useUserInfo(): IUser & { school_id: string } {
    const { data } = useSWR<IUser & { school_id: string }>("/api/user?info", {
        initialData: process.browser ? {
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
        },
        refreshInterval: 1000,
        onError: () => {},
    });
    return data;
}