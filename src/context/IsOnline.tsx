import { createContext, ReactChild, useContext, useEffect, useState } from "react";

const IsOnlineContext = createContext<[boolean, (online: boolean) => void]>([true, (online: boolean) => {}]);
export default function IsOnline({ children }: { children: ReactChild }) {
    const [online, setOnline] = useState(typeof(navigator) !== "undefined" ? navigator.onLine : true);
    useEffect(() => {
        window.addEventListener("online", () => {
            setOnline(true);
        });
        window.addEventListener("offline", () => {
            setOnline(false);
        });
    });
    return (
        <IsOnlineContext.Provider value={[online, setOnline]}>
            {children}
        </IsOnlineContext.Provider>
    );
}
export const useIsOnline = (): [boolean, (online: boolean) => void] => useContext(IsOnlineContext);