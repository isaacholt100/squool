import { createContext, ReactChild, ReactText, useContext, useEffect, useRef } from "react";
import useRefState from "../hooks/useRefState";
import useSnackbar from "../hooks/useSnackbar";

const IsOnlineContext = createContext<[boolean, (online: boolean) => void]>([true, (online: boolean) => {}]);
export default function IsOnline({ children }: { children: ReactChild }) {
    const snackbar = useSnackbar();
    const key = useRef<ReactText>();
    const [online, setState] = useRefState(process.browser ? navigator.onLine : true);
    const unloading = useRef(false);
    function setOnline(o: boolean) {
        if (!unloading.current) {
            if (o && !online.current) {
                key.current && snackbar.close(key.current);
                key.current = snackbar.open("Back online", {
                    variant: "success",
                });
            } else if (!o && online.current) {
                key.current && snackbar.close(key.current);
                key.current = snackbar.open("You're offline - some functionality may be disabled", {
                    variant: "warning",
                });
            }
            setState(o);
        }
    }
    useEffect(() => {
        window.addEventListener("online", () => {
            setOnline(true);
        });
        window.addEventListener("offline", () => {
            setOnline(false);
        });
        window.addEventListener("beforeunload", () => {
            unloading.current = true;
        });
    }, []);
    return (
        <IsOnlineContext.Provider value={[online.current, setOnline]}>
            {children}
        </IsOnlineContext.Provider>
    );
}
export const useIsOnline = (): [boolean, (online: boolean) => void] => useContext(IsOnlineContext);