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
function fetcher(path: string) {
    return sendRequest(path).then(res => res.json());
}
export function prefetch(key: string) {
    sendRequest(path).then(res => mutate(key, res.json(), false));
}
export function getPrefetchProps(key: string) {
    return {
        onMouseEnter: () => prefetch(key),
        //onTouchStart: () => prefetch(key),
        //onFocus: () => prefetch(key),
    }
}