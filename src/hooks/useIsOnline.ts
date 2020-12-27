import { useEffect, useState } from "react";

export default function useIsOnline(): [boolean, (online: boolean) => void] {
    const [online, setOnline] = useState(typeof(navigator.onLine) === "boolean" ? navigator.onLine : true);
    useEffect(() => {
        window.addEventListener("online", () => {
            setOnline(true);
        });
        window.addEventListener("offline", () => {
            setOnline(false);
        });
    });
    return [online, setOnline];
}