import Cookies from "js-cookie";
import useSWR from "swr";
import { useIsOnline } from "../context/IsOnline";

export default function useIsLoggedIn() {
    const [, setOnline] = useIsOnline();
    const l = Boolean(Cookies.get("refreshToken") && Cookies.get("accessToken"));
    const { data, error } = useSWR("/api/login", async url => {
        try {
            const res = await fetch(url);
            const json = res.json();
            process.env.NODE_ENV === "production" && setOnline(true);
            return json;
        } catch (err) {
            process.env.NODE_ENV === "production" && setOnline(false);
            throw err;
        }
    }, {
        refreshInterval: 1000,
        onError: () => {},
        initialData: l,
        //refreshWhenOffline: true,
        //refreshWhenHidden: true,
    });
    if (!error) {
        return data as boolean;
    }
    return l;
}