import Cookies from "js-cookie";
import { useEffect } from "react";
import useSWR from "swr";
import { useIsOnline } from "../context/IsOnline";

export default function useIsLoggedIn() {
    const [, setOnline] = useIsOnline();
    const l = Boolean(Cookies.get("refreshToken") && Cookies.get("accessToken"));
    const { data, error } = useSWR("/api/login", async url => {
        let offline = true;
        try {
            const res = await fetch(url, {
                headers: {
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                }
            });
            offline = false;
            const json = res.json();
            process.env.NODE_ENV === "production" && setOnline(true);
            return json;
        } catch (err) {
            process.env.NODE_ENV === "production" && offline && setOnline(false);
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