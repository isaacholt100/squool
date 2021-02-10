import { createContext, ReactChild, useContext, useEffect } from "react";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import defaultTheme from "../json/defaultTheme.json";
import Cookies from "js-cookie";
import useRefState from "../hooks/useRefState";
import { io } from "socket.io-client";

interface ITheme {
    fontFamily: string;
    primary: string;
    secondary: string;
    type: string;
}

const ThemeContext = createContext([{}, () => {}]);

export default function Theme({ children }: { children: ReactChild }) {
    
    const
        //{ data } = useSWR("/api/user/settings/theme"),
        isLoggedIn = useIsLoggedIn(),
        [theme, setTheme] = useRefState<ITheme>(process.browser ? {
            primary: Cookies.get("theme_primary") || defaultTheme.primary,
            secondary: Cookies.get("theme_secondary") || defaultTheme.secondary,
            type: Cookies.get("theme_type") || defaultTheme.type,
            fontFamily: Cookies.get("theme_fontFamily") || defaultTheme.fontFamily,
        } : defaultTheme),
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
    useEffect(() => {
    }, []);
    useEffect(() => {
        fetch('/api/socketio').finally(() => {
          const socket = io()
            socket.on("/theme", t => {
                console.log(t);
                
                dispatch(t);
            });
          socket.on('connect', () => {
            console.log('connect')
            socket.emit('hello')
          });
    
          socket.on('hello', data => {
            console.log('hello', data)
          })
    
          socket.on('a user connected', () => {
            console.log('a user connected')
          })
    
          socket.on('disconnect', () => {
            console.log('disconnect')
          })
        })
      }, []);
    return (
        <ThemeContext.Provider value={[isLoggedIn ? theme.current : defaultTheme, dispatch]}>
            {children}
        </ThemeContext.Provider>
    );
}
export const useTheme = (): [ITheme, (theme: Partial<ITheme>) => void] => useContext(ThemeContext) as any;