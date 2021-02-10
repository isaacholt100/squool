import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useIsLoggedIn from "./useIsLoggedIn"

export default function useAuthRedirect(): [boolean, (b: boolean) => void] {
    const
        isLoggedIn = useIsLoggedIn(),
        router = useRouter(),
        [isRedirecting, setIsRedirecting] = useState(false);
    useEffect(() => {
        if (isLoggedIn && !isRedirecting) {
            router.replace("/home");
        }
    }, [isLoggedIn]);
    return [isLoggedIn, setIsRedirecting];
}