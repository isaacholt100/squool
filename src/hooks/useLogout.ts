import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { useTheme } from "../context/Theme";

export default function useLogout() {
    const [, setTheme] = useTheme();
    const router = useRouter();
    return () => {
        Cookies.remove("refreshToken");
        Cookies.remove("accessToken");
        Cookies.remove("user_id");
        router.push("/");
        mutate("/api/login", "", false);
        localStorage.clear();
        setTheme(null);
    }
}