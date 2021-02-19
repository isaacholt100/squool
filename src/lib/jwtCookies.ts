import { mutate } from "swr";
import Cookies from "js-cookie";
import IUser from "../types/IUser";

interface ICookieVars {
    accessToken: string;
    refreshToken: string;
    staySignedIn: boolean;
    userInfo: {
        user_id: string;
        school_id?: string;
        role: string;
        email: string;
        firstName: string;
        lastName: string;
        icon: string;
        carouselView: boolean;
    }
}

export default function jwtCookies({ accessToken, refreshToken, staySignedIn, userInfo }: ICookieVars) {
    mutate("/api/login", true, false);
    Cookies.set("loginTimestamp", new Date().getTime().toString(), {
        expires: 1000000,
    });
    Cookies.set("accessToken", accessToken, {
        expires: 1,
    });
    Cookies.set("refreshToken", refreshToken, {
        ...(staySignedIn ? {
            expires: 1000000,
        } : {}),
    });
    for (const key in userInfo) {
        Cookies.set(key, userInfo[key], {
            expires: 100000,
        });
    }
}