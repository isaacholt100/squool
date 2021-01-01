import { mutate } from "swr";
import Cookies from "js-cookie";

export default function jwtCookies({ accessToken, refreshToken, staySignedIn, user_id, school_id, role }: { accessToken: string, refreshToken: string, staySignedIn: boolean, user_id: string, school_id: string, role: string }) {
    Cookies.set("accessToken", accessToken, {...(staySignedIn ? { expires: 1 } : {expires: 1 })});
    Cookies.set("refreshToken", refreshToken, {...(staySignedIn ? { expires: 1000000 } : {})});
    Cookies.set("user_id", user_id, { expires: 1000000 });
    school_id && Cookies.set("school_id", school_id, { expires: 1000000 });
    Cookies.set("role", role, { expires: 1000000 });
    mutate("/api/login", true, false);
}