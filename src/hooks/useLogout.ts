import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { useTheme } from "../context/Theme";

export default function useLogout() {
    const [, setTheme] = useTheme();
    const router = useRouter();
    return () => {
        clearStorage();
        router.push("/login");
        mutate("/api/login", "", false);
        setTheme(null);
    }
}
export function clearStorage() {
    Cookies.remove("refreshToken");
    Cookies.remove("accessToken");
    Cookies.remove("user_id");
    Cookies.remove("loginTimestamp");
    localStorage.clear();
}