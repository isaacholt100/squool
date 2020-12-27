import Cookies from "js-cookie";
import useSWR from "swr";
import { useIsOnline } from "../context/IsOnline";

export default function useIsLoggedIn() {
    const [online, setOnline] = useIsOnline();
    const l = Boolean(Cookies.get("refreshToken") && Cookies.get("accessToken"));
    const { data, error } = useSWR("/api/login", async url => {
        try {
            const res = await fetch(url);
            const json = res.json();
            !online && setOnline(true);
            return json;
        } catch (err) {
            online && setOnline(false);
            throw err;
        }
    }, {
        refreshInterval: 1000,
        onError: () => {},
        initialData: l,
    });
    if (!error) {
        return data as boolean;
    }
    return l;
}