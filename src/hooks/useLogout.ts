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
    for (const cookie in Cookies.get()) {
        Cookies.remove(cookie);
    }
    localStorage.clear();
}