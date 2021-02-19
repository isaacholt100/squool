import { createContext, ReactChild, useContext, useEffect } from "react";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import defaultTheme from "../json/defaultTheme.json";
import Cookies from "js-cookie";
import useRefState from "../hooks/useRefState";
import { io } from "socket.io-client";
import { useRouter } from "next/router";

interface ITheme {
    fontFamily: string;
    primary: string;
    secondary: string;
    type: string;
}

export const DEFAULT_THEME_ROUTES = ["/"];

const ThemeContext = createContext([{}, () => {}]);

export default function Theme({ children, /*initialTheme*/ }: { children: ReactChild, /*initialTheme: Partial<ITheme>*/ }) {
    
    const
        //{ data } = useSWR("/api/user/settings/theme"),
        router = useRouter(),
        isLoggedIn = useIsLoggedIn(),
        [theme, setTheme] = useRefState<ITheme>({
            ...(process.browser ? {
                primary: Cookies.get("theme_primary") || defaultTheme.primary,
                secondary: Cookies.get("theme_secondary") || defaultTheme.secondary,
                type: Cookies.get("theme_type") || defaultTheme.type,
                fontFamily: Cookies.get("theme_fontFamily") || defaultTheme.fontFamily,
            } : defaultTheme),
            //...initialTheme,
        }),
        dispatch = (t: Partial<ITheme>) => {
            const newTheme = t ? {
                ...theme.current,
                ...t,
            } : defaultTheme;
            setTheme(newTheme);
            if (t) {
                for (const key in t) {
                    Cookies.set("theme_" + key, t[key]);
                }
            } else {
                Cookies.remove("theme_primary");
                Cookies.remove("theme_secondary");
                Cookies.remove("theme_type");
                Cookies.remove("theme_fontFamily");
            }
        };
    return (
        <ThemeContext.Provider value={[isLoggedIn && !DEFAULT_THEME_ROUTES.includes(router.route) ? theme.current : defaultTheme, dispatch]}>
            {children}
        </ThemeContext.Provider>
    );
}
export const useTheme = (): [ITheme, (theme: Partial<ITheme>) => void] => useContext(ThemeContext) as any;