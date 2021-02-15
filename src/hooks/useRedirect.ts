import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useIsLoggedIn from "./useIsLoggedIn";
import useLogout from "./useLogout";

export default function useRedirect() {
    const
        isLoggedIn = useIsLoggedIn(),
        router = useRouter();//,
        //[isRedirecting, setIsRedirecting] = useState(false);;
    useEffect(() => {
        if (isLoggedIn as any === "") {
            //router.replace("/");
        } else if (isLoggedIn === false) {
            router.replace("/login?to=" + encodeURIComponent(router.asPath));
        }
    }, [isLoggedIn]);
    return isLoggedIn;
}