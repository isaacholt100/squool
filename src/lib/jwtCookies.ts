import { mutate } from "swr";
import Cookies from "js-cookie";

export default function jwtCookies({ accessToken, refreshToken, staySignedIn, user_id, school_id, role }: { accessToken: string, refreshToken: string, staySignedIn: boolean, user_id: string, school_id: string, role: string }) {
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
    Cookies.set("user_id", user_id, {
        expires: 1000000,
    });
    school_id && Cookies.set("school_id", school_id, {
        expires: 1000000,
    });
    Cookies.set("role", role, {
        expires: 1000000,
    });
}