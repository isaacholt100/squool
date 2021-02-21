import Cookies from "js-cookie";
import { mutate } from "swr";

export default function sendRequest(url: string, options = {}) {
    return fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "authorization": "Bearer " + Cookies.get("accessToken"),
            "authorization-refresh": "Bearer " + Cookies.get("refreshToken"),
            "Access-Control-Expose-Headers": "authorization",
            "Access-Control-Allow-Headers": "authorization",
        },
    });
}
export function prefetch(key: string) {
    mutate(key, sendRequest(key).then(res => []), true);
}
export function getPrefetchProps(key: string) {
    return {
        onMouseEnter: () => prefetch(key),
        //onTouchStart: () => prefetch(key),
        //onFocus: () => prefetch(key),
    }
}