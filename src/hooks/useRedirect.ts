import { useRouter } from "next/router";
import { useEffect } from "react";
import useIsLoggedIn from "./useIsLoggedIn";

export default function useRedirect() {
    const
        isLoggedIn = useIsLoggedIn(),
        router = useRouter();
    useEffect(() => {
        if (isLoggedIn as any === "") {
            //router.replace("/");
        } else if (isLoggedIn === false) {
            router.replace("/login?to=" + encodeURIComponent(router.asPath));
        }
    }, [isLoggedIn]);
    return isLoggedIn;
}