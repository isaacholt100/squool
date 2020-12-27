import { mutate } from "swr";
import Cookies from "js-cookie";

export default function jwtCookies({ accessToken, refreshToken, staySignedIn, user_id }: { accessToken: string, refreshToken: string, staySignedIn: boolean, user_id: string }) {
    sessionStorage.setItem("visited", "1");
    Cookies.set("accessToken", accessToken, {...(staySignedIn ? { expires: 1 } : {expires: 1 })});
    Cookies.set("refreshToken", refreshToken, {...(staySignedIn ? { expires: 1000000 } : {})});
    Cookies.set("user_id", user_id);
    mutate("/api/login", true, false);
    console.log(Cookies.get());
    
}