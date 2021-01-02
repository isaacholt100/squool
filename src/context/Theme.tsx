import { createContext, ReactChild, useContext, useEffect, useState } from "react";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import defaultTheme from "../json/defaultTheme.json";
import Cookies from "js-cookie";
import useSWR from "swr";

interface ITheme {
    fontFamily: string;
    primary: string;
    secondary: string;
    type: "light" | "dark";
}

const ThemeContext = createContext([{}, () => {}]);

export default function Theme({ children }: { children: ReactChild }) {
    const
        isLoggedIn = useIsLoggedIn(),
        [theme, setTheme] = useState(process.browser && isLoggedIn ? {
            primary: Cookies.get("theme_primary") || defaultTheme.primary,
            secondary: Cookies.get("theme_secondary") || defaultTheme.secondary,
            type: Cookies.get("theme_type") as "light" | "dark" || defaultTheme.type,
            fontFamily: Cookies.get("theme_fontFamily") || defaultTheme.fontFamily,
        } : defaultTheme),
        dispatch = (t: Partial<ITheme>) => {
            const newTheme = t ? {
                ...theme,
                ...t,
            } : defaultTheme;
            setTheme(newTheme);
            if (t) {
                for (let key in t) {
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
        <ThemeContext.Provider value={[theme, dispatch]}>
            {children}
        </ThemeContext.Provider>
    );
}
export const useTheme = (): [ITheme, (theme: Partial<ITheme>) => void] => useContext(ThemeContext) as any;