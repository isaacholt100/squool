import Cookies from "js-cookie";
import { mutate } from "swr";
import { useTheme } from "../context/Theme";

export default function useLogout() {
    const [, setTheme] = useTheme();
    return () => {
        mutate("/api/login", "", false);
        Cookies.remove("refreshToken");
        Cookies.remove("accessToken");
        Cookies.remove("user_id");
        localStorage.clear();
        setTheme(null);
    }
}